<?php 

	require_once('../libs/Login.class.php');
	Login::secSessionStart();
	Login::proteger();
	
	$cfig = @parse_ini_file('../cfig/config.ini');
	include('../../../cfig/conexao.php');	
	require_once('../libs/UpdatePos.class.php');	
	require_once('../libs/Strings.class.php');
	
	$status = '';

	foreach($_POST as $postField => $postValue){
		$$postField = addslashes($postValue);
	}
	
	
	$start = @ $calls * $cfig['query list limit'];
	$limit = $cfig['query list limit'];
	
	$meuid 	  = $_SESSION['userid'];
	$meunivel = $_SESSION['usernivel'];
	
	// bloqueia edição de outros ids para nivel acima de moderador 
	$usereditfilter  = $meunivel > 2 ? "AND `userid` = '$meuid'" : '';	
	//$nivelfilter = "AND (`u.nivel` > '".$_SESSION["usernivel"]."' OR `u.id` = '$meuid' )" : ''; // limita para niveis maiores ou seu próprio id
	
	//---------------------------------------------------------------------------------------------------------
	// ADICIONAR ITEM
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Add Item'){

		if(empty($titulo)){die('<span class="required">Informe um <b>TÍTULO</b> para seu imóvel.</span>');}		
		
		$alias = Strings::stringToMeta($titulo);
		$valor = Strings::moneyToInt($valor);
		
		$insert = mysql_query("INSERT INTO `imoveis` 
							 (`userid`,`titulo`, `alias`, `date`, `status`, `catid`, `id_cidade`, `endereco`, 
							  `bairro`, `lat_long`, `quartos`, `garagem`, `valor`, `destaque`) VALUES 
							 ('$meuid', '$titulo', '$alias', NOW(), '$status', '$tipo', '$cidade', '$endereco', 
							  '$bairro', '$lat_long', '$quartos', '$garagem', '$valor', '$destaque') ");
		
		if(@$insert){	
			echo true;
		}
		else {
			echo '<span class="error">Houve um erro ao salvar os dados.</span>';
		}
	}
	
	
	//---------------------------------------------------------------------------------------------------------
	// LISTAR
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Listar'){
		
		$result = array();		
		$wordadhifen = str_replace(' ', '-', $searchword);
		$wordrmhifen = str_replace('-', ' ', $searchword);
		$userfilter = $meunivel > 2 ? "AND i.userid = '$meuid'" : ''; 
		$ativofilter = $activestate && $inactivestate ? '' : "AND ".($activestate ? "i.ativo = '1'" : ($inactivestate ? "i.ativo = '0'" : "i.ativo = '-1'"));		
		
		$sql = mysql_query("SELECT i.*, u.nivel AS u_nivel
							FROM imoveis AS i 
							LEFT JOIN usuarios AS u	
							ON u.id = i.userid
							WHERE (i.titulo LIKE '%$searchword%' OR i.titulo LIKE '%$wordadhifen%' OR i.titulo LIKE '%$wordrmhifen%') 
							$userfilter $ativofilter ".
							($tipo ? "AND i.catid = '$tipo' " : '').
							($status ? "AND i.status = '$status' " : '').
							($cidade ? "AND i.id_cidade = '$cidade' " : '')."					
							ORDER BY i.date DESC LIMIT $start, $limit ");
		
		while($r = mysql_fetch_assoc($sql)){
			
			if($meunivel > 2 && $r['ativo'] == 0 && $meuid != $r['userid']){
				//se não estiver publicado não exibe o item para nivel > moderador 
			}
			else {
				$id = $r['id'];
				$itemusid	= $r['userid'];
				$itemnivel  = $r['u_nivel'];				
				
				
				$item  = '<li id="item'.$id.'" class="item '.($r['ativo']==0?'disabled':'enabled').'" style="display:none">';			
				$item .= '<div class="title-holder" onmouseenter="titleMouseEnter(\''.$id.'\')" onmouseleave="titleMouseLeave(\''.$id.'\')">';			
				$item .= '<span class="title">&nbsp;'.$r['titulo'].'</span>';
				$item .= '<span class="editBtn" onclick="openPopAddItem(\''.$id.'\')" style="display:none"></span>';
				$item .= '</div>';
				$item .= '<div class="actions">';
				$item .= '<span class="deleteBtn" onclick="openDeleteItemConfirm(\''.$id.'\')"></span>';
				$item .= '<span class="moreItensBtn arqs" onclick="openPopEnviaArquivos(\'imob_'.$id.'\')"></span>';
				$item .= '<span class="moreItensBtn imagens" onclick="moreLabelImagesEnter(\''.$id.'\')" onmouseleave="moreLabelImagesLeave(this)"></span>';				
				$item .= '<span class="moreItensBtn text" onclick="selectPopEditor(\''.$id.'\')"></span>';
				$item .= '<span class="publicarBtn" onclick="publicarItem(\''.$id.'\')" ></span>';
				
				
				$item .= '</div>';
				$item .= '</li>';
				
				$result[]['item'] = $item;
			}
		}
		
		echo json_encode($result);
	
	}	
	
	
	//---------------------------------------------------------------------------------------------------------
	// CARREGAR PARA EDIÇÃO
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Load to Edit'){
	
		$result = array();		
		
		$r = mysql_fetch_assoc(mysql_query("SELECT * FROM imoveis WHERE id = '$id' $usereditfilter LIMIT 1"));
		
		$result['titulo']	 = $r['titulo'];		
		$result['status']	 = $r['status'];	
		$result['tipo']	 	 = $r['catid'];
		$result['id_cidade'] = $r['id_cidade'];
		$result['endereco']	 = $r['endereco'];
		$result['bairro']	 = $r['bairro'];
		$result['lat_long']	 = $r['lat_long'];		
		$result['quartos']	 = $r['quartos'];	
		$result['garagem']	 = $r['garagem'];
		$result['valor']	 = $r['valor'] > 0 ? Strings::intToMoney($r['valor']) : '';	
		$result['destaque']	 = $r['destaque'] > 0 ? $r['destaque'] : '';
		
		echo json_encode($result);
	
	}
	

	
	//---------------------------------------------------------------------------------------------------------
	// SALVAR EDIÇÃO
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Save Edit'){
	
		if(empty($titulo)){die('<span class="required">Informe um <b>TITULO</b> para seu imóvel</span>');}
		
		$alias = Strings::stringToMeta($titulo);
		$valor = Strings::moneyToInt($valor);
		
		$update = mysql_query("UPDATE `imoveis` SET `titulo` = '$titulo', `alias` = '$alias', `updated` = NOW(), 
							  `status` = '$status', `catid` = '$tipo', `id_cidade` = '$cidade', `endereco` = '$endereco', 
							  `bairro` = '$bairro', `lat_long` = '$lat_long', `quartos` = '$quartos', 
							  `garagem` = '$garagem', `valor` = '$valor', `destaque` = '$destaque'							  
							   WHERE `id` = '$idItem' $usereditfilter LIMIT 1");

		if($update){
			echo true;
		}
		else {
			echo '<span class="error">Houve um erro ao salvar os dados.</span>';
		}
	}
	
	
	//---------------------------------------------------------------------------------------------------------
	// PUBLICAR - DESPUBLICAR
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Publicar'){
		
		if($meunivel <= 2){ // bloqueia publicação para usuarios nivel 3
		
			$sql = mysql_query("UPDATE `imoveis` SET `ativo` = '$value' WHERE `id` = '$id' $usereditfilter LIMIT 1");
			
			if($sql){
			
				if($value == 1){
					echo 'enabled';
				}
				if($value == 0){
					echo 'disabled';
				}		
			}
		}
		
	}
	
	
	//---------------------------------------------------------------------------------------------------------
	// EXCLUIR
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Excluir'){			

				
		$delete = mysql_query("DELETE FROM `imoveis` WHERE `id` = '$id' $usereditfilter LIMIT 1");
		
		if(@$delete){
		
			mysql_query("DELETE FROM `imoveis_info` WHERE `parent` = '$id' LIMIT 1");	
			
			$imgs = mysql_query("SELECT * FROM imagens WHERE categ = 'imob".$id."' OR categ = 'imob".$id."_1' OR categ = 'imob".$id."_2' ");
			while($img = mysql_fetch_object($imgs)){
				unlink('../../../images/imoveis/'.$img->imagem);
				unlink('../../../images/imoveis/thumbs/'.$img->imagem);
			}	
			mysql_query("DELETE FROM imagens WHERE categ = 'imob".$id."' OR categ = 'imob".$id."_1' OR categ = 'imob".$id."_2' ");
			
			echo true;
		}
		else {
			echo 'Houve um erro ao excluir o item.';
		}
	}
	
	//---------------------------------------------------------------------------------------------------------
	// LOAD TEXT
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Load Text'){	
					
		$field = @$field == 'introtext' ? 'introtext' : 'fulltext';
		$content = mysql_fetch_assoc(mysql_query("SELECT `$field` FROM `imoveis_info` WHERE `parent` = '$id' LIMIT 1"));				
		$rcontent = $content[$field];	
		
		
		$result['content'] = $rcontent;
		$result['return']  = $rcontent ? true : '<span class="required">Conteúdo não encontrado ou ainda não cadastrado.</span>';
		
		echo json_encode($result);
	
	}
	
	
	//-----------------------------------------------------------------------------------------------------------------------
	//	SALVA O TEXTO
	//-----------------------------------------------------------------------------------------------------------------------
	if($act == 'Save Text'){	
		
		$content = trim(addslashes(@$_POST['content']));
		
		
		$field = @$field == 'introtext' ? 'introtext' : 'fulltext';					
		// intro === 0 -> limpa o campo introtext  |  $intro > 0 -> quebra o fulltext  |  se for string não faz nada			
		$textBreaked = is_numeric(@$intro) && $field != 'introtext' ? Strings::stringLimit(strip_tags($content), $intro, '') : 'false';						
					
		$cVer = mysql_query("SELECT * FROM imoveis_info WHERE parent = '$id' LIMIT 1");
		if(mysql_num_rows($cVer) > 0){
			$save = mysql_query("UPDATE `imoveis_info` SET ".($textBreaked != 'false' ? "`introtext` = '$textBreaked', " : '').
								"`$field` = '$content'  WHERE `parent` = '$id' LIMIT 1 ");
		}
		else {
			$save = mysql_query("INSERT INTO `imoveis_info` (`parent`, ".( $textBreaked != 'false' ? "`introtext`, " : '')." `fulltext`) VALUES ('$id', ".( $textBreaked != 'false' ? "'$textBreaked', " : '')."'$content') ");
		}
		
		
		

									 
									 
									 
									 
		if(@$save){
			die(true);
		}
		else {
			die ('<span class="error">Houve um erro ao salvar os dados.</span>');
		}
					
		
	}
	
?>
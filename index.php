<?php 
  require_once('cfig/conexao.php');
?>
<html>
<head>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <meta name="HandheldFriendly" content="true"/>
	<link rel="stylesheet" href="css/stylesheets/screen.css">
  <link rel="stylesheet" href="css/stylesheets/stylesheet.css">    

  <script src="js/jquery-1.10.2.min.js"></script>
  <script type="text/javascript" src="js/common.functions.js"></script>
  <script type="text/javascript" src="js/functions.js"></script>
  <!-- <script src="js/jquery-latest.min.js"></script> -->
  <link type="text/css" rel="Stylesheet" href="css/stylesheets/bjqs.css" />  
  
  <!-- Include the plugin *after* the jQuery library -->
  <script src="js/bjqs-1.3.min.js"></script>

  <script type="text/javascript" src="js/jcarousellite_1.0.1.js"></script>
  <script type="text/javascript">
    $(document).ready(function($) {        
        $('#my-slideshow').bjqs({
            'height' : 772,
            'width' : "100%",
            showcontrols : true,
            centercontrols : false,
            showmarkers : false,
            animduration : 450,
            animspeed : 3000,
            nexttext : '', // Text for 'next' button (can use HTML)
            prevtext : '' // Text for 'previous' button (can use HTML)
        });       

    });
  </script>


  <!-- Add fancyBox main JS and CSS files -->
  <script type="text/javascript" src="js/fancybox/jquery.fancybox.js?v=2.1.5"></script>
  <link rel="stylesheet" type="text/css" href="js/fancybox/jquery.fancybox.css?v=2.1.5" media="screen" />
  <!-- Add Thumbnail helper (this is optional) -->
  <link rel="stylesheet" type="text/css" href="js/fancybox/jquery.fancybox-thumbs.css?v=1.0.7" />
  <script type="text/javascript" src="js/fancybox/jquery.fancybox-thumbs.js?v=1.0.7"></script>
  <script type="text/javascript" src="js/isotope.pkgd.min.js"></script>  
  <script src="js/jquery.featureCarousel.min.js" type="text/javascript" charset="utf-8"></script>
  <link rel="stylesheet" href="css/stylesheets/feature-carousel.css" charset="utf-8" />
  <link type="text/css" href="css/responsivo.css" rel="stylesheet" />
  <link type="text/css" href="css/paginas_responsivo.css" rel="stylesheet" />

  <script type="text/javascript">
      //<![CDATA[
          $(window).load(function() { // makes sure the whole site is loaded
              $("#status").fadeOut(); // will first fade out the loading animation
              $("#preloader").delay(350).fadeOut("slow",function(){                  
                  initApp();                          
              }); // will fade out the white DIV that covers the website.
           
          })
      //]]>      
  </script>


	<title>Sii9 - Creative Studio</title>
</head>
<body>
  <div id="preloader">
      <div id="status"></div>
  </div>
  <!-- topo -->
  <div id="topo">
    <div class="container-holder">
      <a href="#slide-topo" class="logo-topo"></a>
      <div id="menu" class="navigation-menu">
        <ul>
          <a href="#studio"><li>O ESTÚDIO</li></a>
          <a href="#criacao"><li>CRIAÇÕES</li></a>
          <a href="#oque-fazemos"><li>O QUE FAZEMOS</li></a>
          <a href="#planos"><li>CLIENTES</li></a>
          <a href="#sedes"><li>SEDE</li></a>
          <a href="#contato"><li class="ultima-li">CONTATO</li></a>
        </ul>
      </div>
    </div>
  </div>

  <!-- slide topo -->
  <div id="slide-topo">
    <div id="my-slideshow">
      <ul class="bjqs">
        <li><div class="slide-4"></div></li>
        <li><a href="#planos"><div class="slide-3"></div></a></li>
        <li><div class="slide-2"></div></li>
        <li><div class="slide-1"></div></li>
      </ul>
    </div>
    
  </div><!-- final slide topo -->

  <!-- studio -->
  <div id="studio">
    <div id="rasgo"></div>

    <div class="container-holder">
      <div class="container container12">
        <div id="studio-wrapper" class="wrapper-content">
          <div class="kanji-3d"><img src="imagens/kanji-3d.png"></div>

          <h1>O Estúdio</h1><br/>
          <h6>Simples... mas <span>sofisticado!</span></h6>
          <h6>Soluções de grande impacto, <span>criamos o inimaginável</span></h6>
          <h6>para o sucesso da sua marca.</h6>

          <div class="texto">
            O objetivo é um só, tornar a comunicação entre o cliente e o leitor tão clara quanto possível. Imaginar de maneira integrada afim de agregar para atender às necessidades de sua empresa. O principal compromisso é a oferta de soluções variadas e diferenciadas, quais valores quer transmitir, qual o seu público-alvo e como gostaria de ser vista. 
            <br/><br/>
            Criatividade e coerência, com método, planejamento e compromisso.
          </div>

          <h3>Onde tudo se cria e nada se copia!</h3>

          <div class="box-carousel">
            <div class="carousel">
            <ul>
              <?php
              $sql = mysql_query("SELECT * FROM imagens WHERE categ = 'banner' AND published = '1' ORDER BY pos ASC"); 
                while($r = mysql_fetch_assoc($sql)){
                  echo '<li><img src="images/albuns/thumbs/'.$r['imagem'].'"></li>';
                }
              ?>          
            </ul>
          </div>
            <button class="prev">&laquo;</button>
            <button class="next">&raquo;</button>
          </div>
          <div class="kanji-3d-carousel"></div>
        </div>
      </div>
    </div>

    <div id="bg2-holder">
      <div id="studio-kanji-left" class="studio-kanji"></div>
      <div id="studio-kanji-right" class="studio-kanji"></div>
      <div id="bg-bottom"></div>
    </div>

  </div><!-- final studio -->

  
  <!-- criacao -->
  <div id="criacao">
    <div id="bg-top"></div>
    <div class="container-holder">
      <div class="container container12">
        <div id="criacao-wrapper" class="wrapper-content">
          <div class="redes-sociais">
            <a href="https://www.flickr.com/photos/78908201@N03/" target="_blank"><img src="imagens/ico-flickr.png" title="Flickr"></a>
            <a href="https://www.facebook.com/sii9studio" target="_blank"><img src="imagens/ico-facebook.png" title="Facebook"></a>
            <a href="https://www.youtube.com/channel/UCOK2_VcgnNPW9J_9gMleuDQ" target="_blank"><img src="imagens/ico-youtube.png" title="Youtube"></a>
            <!-- <a href="https://br.pinterest.com/sii9creative/" target="_blank"><img src="imagens/ico-pinterest.png" title="Pinterest"></a> -->
            <!--<a href="#this"><img src="imagens/ico-blogger.png" title="Blogger"></a>-->
          </div>

          <h4>Cases de sucesso</h4>

          <ul id="cases-filter" class="menu-case">
            <?php
              $categList = array();
              $sql = mysql_query("SELECT * FROM categorias WHERE parent = '2' AND ativo = '1' ORDER BY pos ASC");
              while($cat = mysql_fetch_object($sql)){
                echo '<li data-filter=".case'.$cat->id.'">'.$cat->titulo.'</li>';
                $categList[] = $cat->id;
              }
            ?>
          </ul>

          <div class="cases" >       
            <ul id="cases-gallery">
              <?php 
                if(count($categList) > 0){
                  $queryFilter = '';
                  $i = 0;
                  foreach($categList as $catid){
                    if($i>0){$queryFilter .= "OR ";}$i++;
                    $queryFilter .= "categ = '$catid' ";
                  }
                  $sql = mysql_query("SELECT * FROM imagens WHERE ($queryFilter) AND published = '1' ORDER BY pos ASC");
                  while($img = mysql_fetch_object($sql)){
                    echo '<li class="case'.$img->categ.'"><a class="fancybox-thumbs" data-fancybox-group="group'.$img->categ.'" href="images/albuns/'.$img->imagem.'" title="'.$img->nome.'"><img src="images/albuns/thumbs/'.$img->imagem.'"></a></li>';
                  }
                }
              ?>
            </ul>
          </div>
          <!--<div class="cases" id="logotipos">
            <ul>
              <a class="fancybox-thumbs-2" data-fancybox-group="thumb" href="imagens/cases/logotipos/case-1.png" title="Titulo"><li><img src="imagens/cases/logotipos/case-1.png"></li></a>
              <a class="fancybox-thumbs-2" data-fancybox-group="thumb" href="imagens/cases/logotipos/case-2.png" title="Titulo"><li><img src="imagens/cases/logotipos/case-2.png"></li></a>
              <a class="fancybox-thumbs-2" data-fancybox-group="thumb" href="imagens/cases/logotipos/case-3.png" title="Titulo"><li><img src="imagens/cases/logotipos/case-3.png"></li></a>
              <a class="fancybox-thumbs-2" data-fancybox-group="thumb" href="imagens/cases/logotipos/case-4.png" title="Titulo"><li><img src="imagens/cases/logotipos/case-4.png"></li></a>
              <a class="fancybox-thumbs-2" data-fancybox-group="thumb" href="imagens/cases/logotipos/case-5.png" title="Titulo"><li><img src="imagens/cases/logotipos/case-5.png"></li></a>
              <a class="fancybox-thumbs-2" data-fancybox-group="thumb" href="imagens/cases/logotipos/case-6.png" title="Titulo"><li><img src="imagens/cases/logotipos/case-6.png"></li></a>
              <a class="fancybox-thumbs-2" data-fancybox-group="thumb" href="imagens/cases/logotipos/case-7.png" title="Titulo"><li><img src="imagens/cases/logotipos/case-7.png"></li></a>
              <a class="fancybox-thumbs-2" data-fancybox-group="thumb" href="imagens/cases/logotipos/case-8.png" title="Titulo"><li><img src="imagens/cases/logotipos/case-8.png"></li></a>
              <a class="fancybox-thumbs-2" data-fancybox-group="thumb" href="imagens/cases/logotipos/case-9.png" title="Titulo"><li><img src="imagens/cases/logotipos/case-9.png"></li></a>
              <a class="fancybox-thumbs-2" data-fancybox-group="thumb" href="imagens/cases/logotipos/case-10.png" title="Titulo"><li><img src="imagens/cases/logotipos/case-10.png"></li></a>
              <a class="fancybox-thumbs-2" data-fancybox-group="thumb" href="imagens/cases/logotipos/case-11.png" title="Titulo"><li><img src="imagens/cases/logotipos/case-11.png"></li></a>
              <a class="fancybox-thumbs-2" data-fancybox-group="thumb" href="imagens/cases/logotipos/case-12.png" title="Titulo"><li><img src="imagens/cases/logotipos/case-12.png"></li></a>
            </ul>
          </div>
          <div class="cases" id="identidade-completa">
            <ul>
              <a class="fancybox-thumbs-3" data-fancybox-group="thumb" href="imagens/cases/identidade-completa/case-1.png" title="Titulo"><li><img src="imagens/cases/identidade-completa/case-1.png"></li></a>
              <a class="fancybox-thumbs-3" data-fancybox-group="thumb" href="imagens/cases/identidade-completa/case-2.png" title="Titulo"><li><img src="imagens/cases/identidade-completa/case-2.png"></li></a>
              <a class="fancybox-thumbs-3" data-fancybox-group="thumb" href="imagens/cases/identidade-completa/case-3.png" title="Titulo"><li><img src="imagens/cases/identidade-completa/case-3.png"></li></a>
              <a class="fancybox-thumbs-3" data-fancybox-group="thumb" href="imagens/cases/identidade-completa/case-4.png" title="Titulo"><li><img src="imagens/cases/identidade-completa/case-4.png"></li></a>
              <a class="fancybox-thumbs-3" data-fancybox-group="thumb" href="imagens/cases/identidade-completa/case-5.png" title="Titulo"><li><img src="imagens/cases/identidade-completa/case-5.png"></li></a>
              <a class="fancybox-thumbs-3" data-fancybox-group="thumb" href="imagens/cases/identidade-completa/case-6.png" title="Titulo"><li><img src="imagens/cases/identidade-completa/case-6.png"></li></a>
              <a class="fancybox-thumbs-3" data-fancybox-group="thumb" href="imagens/cases/identidade-completa/case-7.png" title="Titulo"><li><img src="imagens/cases/identidade-completa/case-7.png"></li></a>
              <a class="fancybox-thumbs-3" data-fancybox-group="thumb" href="imagens/cases/identidade-completa/case-8.png" title="Titulo"><li><img src="imagens/cases/identidade-completa/case-8.png"></li></a>
              <a class="fancybox-thumbs-3" data-fancybox-group="thumb" href="imagens/cases/identidade-completa/case-9.png" title="Titulo"><li><img src="imagens/cases/identidade-completa/case-9.png"></li></a>
              <a class="fancybox-thumbs-3" data-fancybox-group="thumb" href="imagens/cases/identidade-completa/case-10.png" title="Titulo"><li><img src="imagens/cases/identidade-completa/case-10.png"></li></a>
              <a class="fancybox-thumbs-3" data-fancybox-group="thumb" href="imagens/cases/identidade-completa/case-11.png" title="Titulo"><li><img src="imagens/cases/identidade-completa/case-11.png"></li></a>
              <a class="fancybox-thumbs-3" data-fancybox-group="thumb" href="imagens/cases/identidade-completa/case-12.png" title="Titulo"><li><img src="imagens/cases/identidade-completa/case-12.png"></li></a>
            </ul>
          </div>-->
        </div>
      </div>
    </div>
    <div id="criacao-bg2">
      <div id="bg-criacao-passaro"></div>
      <div id="bg-criacao-montanhas"></div>
    </div>
  </div><!-- final criacao -->

  <!-- oque-fazemos -->
  <div id="oque-fazemos">



    <div class="container-holder">
      <div class="container container12">
      
      <div id="grafico-holder" class="wrapper-content">    
        
        <div class="info"><h3>
          <span class="light">Design</span> Gráfico</h3>          
          <p class="desc">Soluções em comunicação visual , arte final , projetos de criação e reformulação de identidade visual para apresentação da marca de sua empresa.</p>
        </div>
        <div class="odesign-kenji"><img src="images/odesign_kenji.png" alt=""/></div>
      </div>

      <hr>

      <div id="logotipo-holder" class="wrapper-content">        
        <div id="feature-carousel-holder" class="feature-carousel-holder" > 
          <div class="info">
            <h3>Logotipo</h3>
            <!-- <p class="desc">Criação de Logotipos e modernização de identidade visual.</p> -->
          </div>
          <div id="feature-carousel" class="feature-carousel">  
            <?php 
            $imgSql = mysql_query("SELECT * FROM imagens WHERE categ = '14' AND published = '1' ORDER BY pos ASC");
            while($img = mysql_fetch_object($imgSql)){
              echo '<div class="carousel-feature">';
              echo '<img class="carousel-image" alt="'.$img->nome.'" src="images/albuns/'.$img->imagem.'">';
              echo '</div>';
            }
            ?>
          </div>

          <div class="carousel-left"><img src="images/arrow-left.png" /></div>
          <div class="carousel-right"><img src="images/arrow-right.png" /></div>

        </div>
      </div>


    <!-- 
    
      <div id="box-principal">
        <div class="box-1">
          <br/><br/><br/><br/><br/>
          <h1>O que fazemos</h1><br/>
          <h6>A sii9 sempre prioriza a qualidade e o diferencial dos serviços para nossos clientes. <br/>
              Acreditamos que mais importante do que conquistar uma cartela de clientes , solucionar seus problemas é a nossa maior vitória!  </h6>
          <div class="box-img">
            <ul>
              <li><img src="imagens/design-grafico.png"><div class="text link-box-1" style="width:230px">Design Gráfico</div></li>
              <li><img src="imagens/marketing.png"><div class="text" style="width:245px">Marketing</div></li>
              <li><img src="imagens/webdesign.png"><div class="text" style="width:290px">Web Design</div></li>
            </ul>
          </div>
        </div>

        <div class="box-2 box">
          <img src="imagens/design-grafico-conteudo.png">
        </div>

        <div class="box-3 box">
          <img src="imagens/marketing-conteudo.png">
        </div>

        <div class="box-4 box">
          <img src="imagens/webdesign-conteudo.png">
        </div>
      </div>
      <ul class="ico-menu">
        <li><img src="imagens/ico-marketing.png"></li>
        <li><img src="imagens/ico-design-grafico.png"></li>
        <li><img src="imagens/ico-webdesign.png"></li>
      </ul>
    </div>
    -->
    </div>
  </div>
</div>
  </div><!-- final oque-fazemos -->

  <!-- frase -->
  <div id="frase"><img src="imagens/frase.png" alt=""/></div><!-- final frase -->

  <!-- planos -->
  <div id="planos">
    <div class="alinhamento">
        <div id="slider-holder">
         <?php 
         $params['categ'] = 15;
         $moduleUrl = 'modules/banner_nivo_slider';
         include($moduleUrl.'/default.php'); 
         ?> 
        </div>
      </div>
  </div><!-- final planos -->

  <!-- sedes -->
  <div id="sedes">
    <div class="alinhamento">
        <img src="imagens/sedes.png" alt="" />
    </div>
  </div><!-- final sedes -->

  <!-- contato -->
  <div id="contato"> 
    <div class="bg2"></div>

    
 <div class="container-holder">
      <div class="container container12">
        <div class="contato-main wrapper-content">
          <div class="icon-ola"><img src="imagens/ola-contato.png"></div>

          <h5>VAMOS <span>CONVERSAR</span></h5><br/>
          <h6>Faça uma visita ou entre em contato, será um prazer atende-lo(a)</h6>

          <div class="box-contatos">
            <ul>
              <li >
                <img src="imagens/ico-local.png">
                <div class="cidade">Balneário Camboriú</div>            
                <!-- <div class="tel">
                    <img style="padding-top: 5px;" src="imagens/ico-contato.png">  <img style="padding-top: 5px; margin-left: 20px" src="imagens/ico-contato.png">Yago Yuri  <img style="padding-top: 5px; margin-left: 20px" src="imagens/ico-contato.png">Ygor Yan</div> -->
                
                <ul class="fones">
                  <li>
                    <p>Allan Junior</p>
                    <span>(47) 9698-4548</span>
                  </li>
                  <li>
                    <p>Yago Yuri</p>
                    <span>(47) 9682-7778</span>
                  </li>
                  <li>
                    <p>Ygor Yan</p>
                    <span>(47) 9774-3824</span>
                  </li>
                </ul>

                <div class="info-contato">
                  Rua 1500 Nº 577 Sala 11 - Edifício Coliseum - Centro<br/>
                  Balneário Camboriú - SC<br/>
                  Telefone: (47) 3056-2221<br/>
                  sii9@sii9.com.br<br/>
                  sii9.com.br<br/>
                  <br/>
                  <a href="https://www.google.com.br/maps/place/Balne%C3%A1rio+Cambori%C3%BA,+SC/@-27.008161,-48.6266309,12z/data=!3m1!4b1!4m2!3m1!1s0x94d8b668abfea471:0x4fca490504a87e6e?hl=pt-BR" target="_blank">Veja no mapa</a>
                </div>
              </li>
            </ul>

          </div>

          <div class="barra-contato"><img src="imagens/barra-contato.png"></div>

          <div class="box-img">
            <ul id="form">
              <a href="#this"><li class="primeira-li"><img src="imagens/chat-online.png"></li></a>
              <li><img class="link-entre-em-contato" src="imagens/entre-em-contato.png">
                <form action="enviar-contato.php" method="POST" target="iAjax" class="form-entre-em-contato">
                  <input type="text" name="nome" id="nome" placeholder="NOME" />
                  <input type="text" name="email" id="email" placeholder="EMAIL" />
                  <input type="text" name="assunto" id="assunto" placeholder="ASSUNTO" />
                  <textarea name="mensagem" id="mensagem" placeholder="MENSAGEM"></textarea>
                  <input type="submit" value="ENVIAR">
                  <input type="button" value="FECHAR" class="fechar-form">
                </form>
              </li>
              <li class="form-solicite-orcamento">
                <img class="link-solicite-orcamento" src="imagens/solicite-orcamento.png">
                <form action="enviar-orcamento.php" method="POST" target="iAjax" class="form-entre-em-contato-2">
                  <input type="text" name="nome" id="nome2" placeholder="NOME" />
                  <input type="text" name="email" id="email2" placeholder="EMAIL" />
                  <select name="servico" id="servico2"><option>SERVIÇO</option><option>DESIGN GRÁFICO</option><option>MARKETING</option><option>WEB DESIGN</option></select>
                  <textarea name="mensagem" id="mensagem2" placeholder="DESCRIÇÃO"></textarea>
                  <input type="submit" value="ENVIAR">
                  <input type="button" value="FECHAR" class="fechar-form-2">
                </form>
              </li>
            </ul>
            <iframe name="iAjax" style="display: none"></iframe>
          </div>

          <div class="logo-contato">
            <img src="imagens/logo-contato.png">
          </div>

          <div id="footer">
            <div class="txt">Copyright © 2014 Sii9 - Todos os direito reservados.</div>

            <div class="allanjuniorian">
              <a href="http://allanjuniorian.com.br" target="_blank"><img src="imagens/allanjuniorian.png"></a>
            </div>
          </div>


        </div>
      </div>
    </div>

  </div><!-- final contato -->

</body>
    
</html>
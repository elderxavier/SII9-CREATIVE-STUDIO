 <?php

$date = date("d/m/Y h:i");



// ****** ATEN��O ********

// ABAIXO EST� A CONFIGURA��O DO SEU FORMUL�RIO.

// ****** ATEN��O ********



// RECEBE OS VALORES VINDO DO FORMUL�RIO E ATRIBUI AS VARI�VEIS

$nome     = $_POST['nome'];

$email    = $_POST['email'];

$assunto  = $_POST['assunto'];

$mensagem = $_POST['mensagem'];




//CABE�ALHO - ONFIGURA��ES SOBRE SEUS DADOS E SEU WEBSITE

$nome_do_site="Sii9 - Creative Studio";

$email_para_onde_vai_a_mensagem = "sii9studio@gmail.com";

$nome_de_quem_recebe_a_mensagem = "Sii9";

$exibir_apos_enviar="<script>alert('Mensagem enviada com sucesso!')</script>";



//MAIS - CONFIGURA�OES DA MENSAGEM ORIGINAL

$cabecalho_da_mensagem_original="From:<$email>\n";

$assunto_da_mensagem_original="$assunto";



// FORMA COMO RECEBER� O E-MAIL (FORMUL�RIO)

// ******** OBS: SE FOR ADICIONAR NOVOS CAMPOS, ADICIONE OS CAMPOS NA VARI�VEL ABAIXO *************

$configuracao_da_mensagem_original="





ENVIADO POR:<br/>

Nome: $nome<br/>

E-mail: $email<br/>

Assunto: $assunto<br/>

Mensagem: $mensagem<br/>

ENVIADO EM: $date



";



//CONFIGURA��ES DA MENSAGEM DE RESPOSTA

// CASO $assunto_digitado_pelo_usuario="s" ESSA VARIAVEL RECEBERA AUTOMATICAMENTE A CONFIGURACAO

// "Re: $assunto"

$assunto_da_mensagem_de_resposta = "$assunto";

$cabecalho_da_mensagem_de_resposta = "From: $nome_do_site < $email_para_onde_vai_a_mensagem>\n";

$configuracao_da_mensagem_de_resposta="";



// ****** IMPORTANTE ********

// A PARTIR DE AGORA RECOMENDA-SE QUE N�O ALTERE O SCRIPT PARA QUE O SISTEMA FINCIONE CORRETAMENTE

// ****** IMPORTANTE ********



//ESSA VARIAVEL DEFINE SE � O USUARIO QUEM DIGITA O ASSUNTO OU SE DEVE ASSUMIR O ASSUNTO DEFINIDO

//POR VOC� CASO O USUARIO DEFINA O ASSUNTO PONHA "s" NO LUGAR DE "n" E CRIE O CAMPO DE NOME

//'assunto' NO FORMULARIO DE ENVIO

$assunto_digitado_pelo_usuario="s";



//ENVIO DA MENSAGEM ORIGINAL 

$headers = "$cabecalho_da_mensagem_original";



if($assunto_digitado_pelo_usuario=="n"){

$assunto = "$assunto_da_mensagem_original";

}

$seuemail = "$email_para_onde_vai_a_mensagem";

$mensagem = $configuracao_da_mensagem_original;

$headers = "MIME-Version: 1.0\n"; 

$headers .= "Content-type: text/html; charset=UTF-8\n"; 

$headers .= "From: $nome_do_site <'Mix Promo'>\n";

mail($seuemail,$assunto,$mensagem,$headers);



//ENVIO DE MENSAGEM DE RESPOSTA AUTOMATICA

$header = "$cabecalho_da_mensagem_de_resposta";

$header = "MIME-Version: 1.0\n"; 

$header .= "Content-type: text/html; charset=UTF-8\n"; 

$header .= "From: $nome_do_site <'Allan Junior Empreendimentos'>\n";

if($assunto_digitado_pelo_usuario=="n"){

$assunto = "$assunto_da_mensagem_de_resposta";

}else{

$assunto = "Re: $assunto";

}





$mensagem = "$configuracao_da_mensagem_de_resposta";

mail($email,$assunto,$mensagem,$header);

echo $exibir_apos_enviar;



?>

<script type="text/javascript">

	parent.document.getElementById('nome').value="";
	parent.document.getElementById('email').value="";
	parent.document.getElementById('assunto').value="";
	parent.document.getElementById('mensagem').value="";

</script>
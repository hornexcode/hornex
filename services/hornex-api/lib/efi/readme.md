# Gerar certificado e chave em único arquivo

openssl pkcs12 -in certificado.p12 -out certificado.pem -nodes -password pass:""

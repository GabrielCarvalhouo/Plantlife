/*
  Alterado por: Fernando Costenaro Silva 
  Baseado no exemplo de:
 
  Rui Santos
  Complete project details at https://RandomNerdTutorials.com
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files.
  
  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
*/

// Importa as bibliotecas necessarias
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>


// Substitua com as credenciais da sua rede
const char* ssid     = "plantLife";
const char* password = "12345678";

// Seu endereço de IP estático (será atribuido à placa)
IPAddress local_IP(192, 168, 43, 30);
// O endereço do gateway
IPAddress gateway(192, 168, 43, 1);

IPAddress subnet(255, 255, 255, 0);
IPAddress primaryDNS(8, 8, 8, 8);   //opcional
IPAddress secondaryDNS(8, 8, 4, 4); //opcional

const int trigPin = 12;
const int echoPin = 14;
const int pinoSensor = A0;
const int pinoLED = 2; //D4

int analogSoloSeco = 400; //VALOR MEDIDO COM O SOLO SECO (VOCÊ PODE FAZER TESTES E AJUSTAR ESTE VALOR)
int analogSoloMolhado = 150; //VALOR MEDIDO COM O SOLO MOLHADO (VOCÊ PODE FAZER TESTES E AJUSTAR ESTE VALOR)
int percSoloSeco = 0; //MENOR PERCENTUAL DO SOLO SECO (0% - NÃO ALTERAR)
int percSoloMolhado = 100; //MAIOR PERCENTUAL DO SOLO MOLHADO (100% - NÃO ALTERAR)

String strDistancia;
String strUmidade;
#define SOUND_VELOCITY 0.034

long duration;
float distanceCm;

// Cria um objeto AsyncWebServer na porta 80
AsyncWebServer server(80);

String getValorUmidade() {
  int valorLido = analogRead(pinoSensor);
  //map(value, fromLow, fromHigh, toLow, toHigh)
  //float valorConvertido = float(map(valorLido, 0, 1023, 0, 33))/10.0; //le em inteiro de 0 a 33 e divide por 10 -> saida de 0 a 3.3 V
  Serial.println("valor analogico lido: " + String(valorLido));
  return String(valorLido);
}

String getValorDistancia(){

    // Clears the trigPin
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    // Sets the trigPin on HIGH state for 10 micro seconds
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    
    // Reads the echoPin, returns the sound wave travel time in microseconds
    duration = pulseIn(echoPin, digitalRead(echoPin) == HIGH ? LOW : HIGH);
    
    // Calculate the distance
    distanceCm = duration * SOUND_VELOCITY/2;
    
    // Prints the distance on the Serial Monitor
    Serial.print("Distance (cm): ");
    Serial.println(distanceCm);
    
    delay(1000);
    return String(distanceCm);
}
 
void setup(){
  // Porta Serial para debug
  Serial.begin(115200);
  //entrada analógica já vem configurada no pino A0
  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input
  pinMode(pinoLED, OUTPUT);
  
  // Configura o endereço IP estático
  if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
    Serial.println("Falha ao configurar em modo Station (STA)");

  }
  
  // Conecta na rede Wi-Fi com o SSID e senha (password)
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  // Imprime pela serial o endereço de IP e inicia o servidor web
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
 
  // Rota para comandar a saida digital (Liga / ON)
  server.on("/molhar/on", HTTP_GET, [](AsyncWebServerRequest *request){
    digitalWrite(pinoLED, LOW);
    request->send_P(200, "text/plain", "ON");  
  });
  
  // Rota para comandar a saida digital (Desliga / OFF)
  server.on("/molhar/off", HTTP_GET, [](AsyncWebServerRequest *request){
    digitalWrite(pinoLED, HIGH);
    request->send_P(200, "text/plain", "OFF");
  });

  // Rota para ler a entrada analogica
  server.on("/altura", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send_P(200, "text/plain", getValorDistancia().c_str());
  });

  // Rota para ler a entrada analogica
  server.on("/umidade", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send_P(200, "text/plain", getValorUmidade().c_str());
  });
  
  // Adiciona no cabeçalho para evitar erro de acesso do CORS
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  // Inicia o servidor
  server.begin();
}
 
void loop(){
  
}

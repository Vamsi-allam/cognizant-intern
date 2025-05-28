package com.example.service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.time.LocalDateTime;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.azure.messaging.servicebus.ServiceBusClientBuilder;
import com.azure.messaging.servicebus.ServiceBusErrorContext;
import com.azure.messaging.servicebus.ServiceBusProcessorClient;
import com.azure.messaging.servicebus.ServiceBusReceivedMessage;
import com.azure.messaging.servicebus.ServiceBusReceivedMessageContext;
import com.example.entity.Atm;
import com.example.entity.AtmCashflow;
import com.example.entity.AtmTemperature;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service

public class ServiceBusListener {

    private String connectionString = "your-service-bus-connection-string";

    private String topicName = "your-topic-name";

    private String subscriptionName = "your-subscription-name";

    @Value("${spring.datasource.url}")
    private String jdbcUrl;

    @Value("${spring.datasource.username}")
    private String jdbcUsername;

    @Value("${spring.datasource.password}")
    private String jdbcPassword;

    @PersistenceContext
    private EntityManager entityManager;

    private ServiceBusProcessorClient processorClient;


    @PostConstruct

    public void startListening() {

        processorClient = new ServiceBusClientBuilder()

                .connectionString(connectionString)

                .processor()

                .topicName(topicName)

                .subscriptionName(subscriptionName)

                .processMessage(this::processMessage)

                .processError(this::processError)

                .buildProcessorClient();

        System.out.println("Starting Service Bus listener...");

        processorClient.start();

    }

    public void processMessage(ServiceBusReceivedMessageContext context) {
        ServiceBusReceivedMessage message = context.getMessage();
        System.out.println("Received message: " + message.getBody());

        JSONObject jsonObj = new JSONObject(message.getBody().toString());
        int type = jsonObj.getInt("type");
        int atm_id=0;
        switch(type) {
    //     case 1:
            
    //         JSONObject cashObject= jsonObj.getJSONObject("atm");
    //         atm_id = cashObject.getInt("atmId");
    //         System.out.println(atm_id);
    //         int hnotes = jsonObj.getInt("cash100");
    //         int thnotes = jsonObj.getInt("cash200");
    //         int fhnotes = jsonObj.getInt("cash500");
    //         String timestamp = LocalDateTime.now().toString();
    //         AtmCashflow cfd = new AtmCashflow();
    //         cfd.setCash100(hnotes);
    //         cfd.setCash200(thnotes);
    //         cfd.setCash500(fhnotes);
    //         cfd.setUpdatedAt(timestamp);
    //         Atm cash = entityManager.find(Atm.class, atm_id);
    //         cfd.setAtm(cash);
    // 	try {
     
    //       try (Connection connection = DriverManager.getConnection(jdbcUrl, jdbcUsername, jdbcPassword)) {
    //           connection.setAutoCommit(false); 
  
    //           String insertSql = "INSERT INTO atm_cashflow (atm_id,cash100,cash200,cash500,updated_at) VALUES (?, ?,?,?,?)";
    //           try (PreparedStatement insertStatement = connection.prepareStatement(insertSql)) {
    //         	  insertStatement.setInt(1, cfd.getAtm().getAtmId());
    //         	  insertStatement.setInt(2, cfd.getCash100());
    //               insertStatement.setInt(3, cfd.getCash200());
    //               insertStatement.setInt(4, cfd.getCash500());
    //               insertStatement.setString(5, cfd.getUpdatedAt());
    //               insertStatement.executeUpdate();
    //           }
              
    //           System.out.println("Cash Flow data inserted sucessfully");
  
    //           connection.commit(); 
    //       }
    //   } catch (Exception e) {
    //       System.err.println("Error processing message: " + e.getMessage());
    //   }
    // break;
    case 2:
        JSONObject atmObject= jsonObj.getJSONObject("atm");
    	atm_id = atmObject.getInt("atmId");
        System.out.println(atm_id);
    	Double temperature = jsonObj.getDouble("temperature");
    	String recordedAt = LocalDateTime.now().toString();
    	AtmTemperature td  = new AtmTemperature();
        td.setTemperature(temperature);
        td.setRecordedAt(recordedAt);

        Atm atm = entityManager.find(Atm.class, atm_id);
        td.setAtm(atm);
        
    	
    	try {
          try (Connection connection = DriverManager.getConnection(jdbcUrl, jdbcUsername, jdbcPassword)) {
              connection.setAutoCommit(false); 
  
             
              String insertSql = "INSERT INTO atm_temperature (atm_id,temperature,recorded_at) VALUES (?,?, ?)";
              try (PreparedStatement insertStatement = connection.prepareStatement(insertSql)) {
                  insertStatement.setInt(1, td.getAtm().getAtmId());
                  insertStatement.setDouble(2, td.getTemperature());
    				insertStatement.setString(3,td.getRecordedAt());
                  insertStatement.executeUpdate();
              }
              System.out.println("Temperature data inserted sucessfully");
              connection.commit(); 
          }
      } catch (Exception e) {
          System.err.println("Error processing message: " + e.getMessage());
      }	
    break;
    }    
}
private void processError(ServiceBusErrorContext context) {

  System.err.println("Error occurred: " + context.getException().getMessage());

}
}





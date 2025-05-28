package com.example.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.entity.AtmCashflow;
import com.example.entity.AtmTemperature;
import com.microsoft.azure.sdk.iot.device.DeviceClient;
import com.microsoft.azure.sdk.iot.device.IotHubClientProtocol;
import com.microsoft.azure.sdk.iot.device.IotHubStatusCode;
import com.microsoft.azure.sdk.iot.device.Message;
import com.microsoft.azure.sdk.iot.device.MessageSentCallback;
import com.microsoft.azure.sdk.iot.device.exceptions.IotHubClientException;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class AtmController {
    private String connStringtemp = "your-iot-hub-connection-string-for-temperature-device";
    private String connStringcash = "your-iot-hub-connection-string-for-cashflow-device";
    private static IotHubClientProtocol protocol = IotHubClientProtocol.MQTT;
    private static class EventCallback implements MessageSentCallback {
        private String status;
        @Override
        public void onMessageSent(Message sentMessage, IotHubClientException exception, Object callbackContext) {
            status = (exception == null ? IotHubStatusCode.OK.toString() : exception.getStatusCode().toString());
            System.out.println("IoT Hub responded to message with status: " + status);
            if (callbackContext != null) {
                synchronized (callbackContext) {
                    callbackContext.notify();
                }
            }
        }
        public String getStatus() {
            return status;
        }
    }
    @PostMapping("/sendtemp")
    public ResponseEntity<?> createAtmTemperature(@RequestBody AtmTemperature atmTemperature) {
        try {
            DeviceClient client = null;
            try {
                client = new DeviceClient(connStringtemp, protocol);
                client.open(true);

                String msgStr = atmTemperature.serialize();
                Message msg = new Message(msgStr);
                msg.setProperty("type", String.valueOf(atmTemperature.getType()));
                System.out.println("Sending message: " + msgStr);
                Object lockobj = new Object();
                EventCallback callback = new EventCallback();
                client.sendEventAsync(msg, callback, lockobj);

                synchronized (lockobj) {
                    lockobj.wait(5000);
                }

                String status = callback.getStatus();
                if (status == null) {
                    return ResponseEntity.status(500).body("Timeout waiting for IoT Hub response");
                }
                return ResponseEntity.ok("Message sent successfully to IoT Hub with status: " + status);
            } finally {
                if (client != null) {
                    client.close();
                }
            }
        } catch (IotHubClientException e) {
            return ResponseEntity.status(500).body("IoT Hub client error: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body("Invalid telemetry data: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error sending message to IoT Hub: " + e.getMessage());
        }
    }
    @PostMapping("/sendcash")
    public ResponseEntity<?> createAtmCashflow(@RequestBody AtmCashflow atmCashflow) {
        try {
            DeviceClient client = null;
            try {
                client = new DeviceClient(connStringcash, protocol);
                client.open(true);
                String msgStr = atmCashflow.serialize();
                Message msg = new Message(msgStr);
                msg.setProperty("type", String.valueOf(atmCashflow.getType()));
                System.out.println("Sending message: " + msgStr);
                Object lockobj = new Object();
                EventCallback callback = new EventCallback();
                client.sendEventAsync(msg, callback, lockobj);
                synchronized (lockobj) {
                    lockobj.wait(5000);
                }
                String status = callback.getStatus();
                if (status == null) {
                    return ResponseEntity.status(500).body("Timeout waiting for IoT Hub response");
                }
                return ResponseEntity.ok("Message sent successfully to IoT Hub with status: " + status);
            } finally {
                if (client != null) {
                    client.close();
                }
            }
        } catch (IotHubClientException e) {
            return ResponseEntity.status(500).body("IoT Hub client error: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body("Invalid telemetry data: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error sending message to IoT Hub: " + e.getMessage());
        }
    }
}
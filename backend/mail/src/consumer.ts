import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
// let channel: amqp.Channel;
export const startSendOtpConsumer = async () => {
    try {
        
         const connection = await amqp.connect({ 
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST,
            port: 5672, 
            username: process.env.RABBITMQ_USER,
            password: process.env.RABBITMQ_PASSWORD,
        })
        const channel = await connection.createChannel();
        const queueName = 'send-otp' 
        await channel.assertQueue(queueName, { durable: true });
        console.log("✅ Mail service consumer started , listening for otm emails");
        
        channel.consume(queueName, async (msg) => {
            if(msg) {
                   try {
                  const {to, subject, body} = JSON.parse(msg.content.toString());

            // Create a transporter
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            await transporter.sendMail({
                from: 'Chat-APP', 
                to, 
                subject,
                text: body,
            });
            
            console.log(`OTP email sent to ${to}`);
            channel.ack(msg);
            } catch (error) {
                console.log("Failed to send OTP");
                
            }
            }
         
        });
    }catch (error) {
        console.log("Failed to start RabbitMQ Consumer", error);
        
    }
}    
const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/711379610854/deployment-events';

async function poll() {
    const params = {
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 5
    };

    try {
        const data = await sqs.receiveMessage(params).promise();
        if (data.Messages) {
            data.Messages.forEach(msg => {
                console.log("Received message:", msg.Body);
                // Delete after processing
                sqs.deleteMessage({
                    QueueUrl: QUEUE_URL,
                    ReceiptHandle: msg.ReceiptHandle
                }, (err) => {
                    if (err) console.log("Delete error", err);
                });
            });
        }
    } catch (err) {
        console.error("Error polling SQS:", err);
    }
    setTimeout(poll, 5000);
}

poll();

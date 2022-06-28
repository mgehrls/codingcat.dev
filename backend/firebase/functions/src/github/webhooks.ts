import { good, log, LogSeverity } from './../utilities/logging';
import * as functions from 'firebase-functions';
import { firestore } from './../config/config';
import { WebhookPayload } from '../models/github';
import { sendTopic } from '../utilities/googleapis';
import * as admin from 'firebase-admin';

export const topicId = 'gitHubSponsorship';

export const gitHubSponsorshipWebhook = functions.https.onRequest(
  async (req, res) => {
    log(LogSeverity.DEBUG, 'Headers', req.headers);
    log(LogSeverity.DEBUG, req.body);
    const webhookPayload: WebhookPayload = req.body;

    // TODO: Implement https://calendly.stoplight.io/docs/api-docs/ZG9jOjIxNzQ1ODY-webhook-signatures
    if (!webhookPayload) {
      good(res, 'No payload');
      return;
    }

    if (!webhookPayload?.sponsorship?.node_id) {
      good(res, 'Sponsorship missing Node Id for storing.');
      return;
    }

    await firestore
      .doc(`gitHubSponsorshipLog/${webhookPayload?.sponsorship?.node_id}`)
      .collection('webhook')
      .add({
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        ...webhookPayload,
      });

    await sendTopic(topicId, webhookPayload);
    good(res, `Sent Topic: ${topicId}`);
  }
);

export const gitHubSponsorshipPubSub = functions.pubsub
  .topic(topicId)
  .onPublish(async (message, context) => {
    log(LogSeverity.DEBUG, 'The function was triggered at', context.timestamp);
    log(LogSeverity.DEBUG, 'The unique ID for the event is', context.eventId);
    log(LogSeverity.DEBUG, message);
  });

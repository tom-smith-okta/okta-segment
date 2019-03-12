# Okta + Segment.io

When the page loads, there are two possible states:

1. The user already has an Okta session
 * In this case, we are not going to do anything.
 * We are going to let the Segment.io js work its magic to update the destinations
 * Segment.io will look in local storage for a segment.io id and update its events accordingly

2. The user does not have an Okta session
 * In this case, 


 Segment docs

 The identify method is how you associate your users and their actions to a recognizable userId and traits. You can see an identify example in the guide or find details on the identify method payload.

Note: We recommend against using identify for anonymous visitors to your site. analytics.js automatically retrieves an anonymousId from localStorage or assigns one for new visitors. It will be attached to all page and track events both before and after an identify.


https://segment.com/docs/spec/identify/



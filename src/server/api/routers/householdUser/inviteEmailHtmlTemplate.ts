export const emailHtmlTemplate = (
  senderName: string,
  emailInviteLink: string,
  isNewUser: boolean,
): string => {
  const conditionalSentence = isNewUser
    ? "To get started, simply click the button below to accept your invitation and set up your account:"
    : "To access this shared household, simply click the button below to log in to your account:";
  return `
  <html>
<head>
  <title>Invite to OurHouse App</title>
  <style>
    body {
      font-family: sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #007bff; /* A nice blue for the header */
      margin: 0;
    }
    .content {
      margin-bottom: 30px;
    }
    .content p {
      margin-bottom: 15px;
    }
    .button {
      display: inline-block;
      background-color: #b372f0;
      color: #000;
      padding: 12px 25px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      text-align: center;
    }
    .button:hover {
      background-color: #cdacec;
    }
    .footer {
      text-align: center;
      font-size: 0.9em;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>You've been invited to OurHouse!</h1>
    </div>
    <div class="content">
      <p>Hello!</p>
      <p>
        <strong>${senderName}</strong> has invited you to join their household on the OurHouse app.
        OurHouse helps you manage household tasks, share information, and stay organized with your family or housemates.
      </p>
      <p>
        ${conditionalSentence}
      </p>
      <p style="text-align: center;">
        <a href=${emailInviteLink} class="button">Join OurHouse Now</a>
      </p>
    </div>
    <div class="footer">
      <p>This invitation will expire in three days</p>
      <p>&copy; ${new Date().getFullYear()} OurHouse App. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
};

/**
 *       <p>
        If the button above doesn't work, you can also copy and paste the following link into your browser:
      </p>
      <p style="word-break: break-all;">
        <a href="${emailInviteLink}">${emailInviteLink}</a>
      </p>
 */

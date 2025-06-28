export interface TemplateVariables {
  [key: string]: string | number | boolean;
}

export function renderBasicTemplate(variables: TemplateVariables = {}): string {
  const {
    title = "Grant Fox Notification",
    userName = "User",
    message = "This is a notification from Grant Fox.",
    ctaText = "View Details",
    ctaUrl = "#",
    ...otherVars
  } = variables;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .content { padding: 20px 0; }
        .cta-button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
    </div>
    
    <div class="content">
        <p>Hello ${userName},</p>
        <p>${message}</p>
        
        ${ctaUrl !== "#" ? `<a href="${ctaUrl}" class="cta-button">${ctaText}</a>` : ""}
    </div>
    
    <div class="footer">
        <p>This email was sent by Grant Fox Platform.</p>
        <p>If you no longer wish to receive these emails, you can unsubscribe.</p>
    </div>
</body>
</html>
  `.trim();
}

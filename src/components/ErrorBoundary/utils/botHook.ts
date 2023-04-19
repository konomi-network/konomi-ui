const reportToLarkBot = (error: Error, info: React.ErrorInfo) => {
  if (process.env.NODE_ENV === 'production') {
    fetch('https://open.larksuite.com/open-apis/bot/v2/hook/94a3a6f0-2e43-4dd8-bd4b-efb0e0d5a1cb', {
      method: 'POST',
      body: JSON.stringify({
        msg_type: 'interactive',
        card: {
          config: {
            wide_screen_mode: true,
            enable_forward: true
          },
          elements: [
            {
              tag: 'markdown',
              content: `**[URL - ${window.location.href}]($urlVal)**`,
              href: {
                urlVal: {
                  url: window.location.href
                }
              }
            },
            {
              tag: 'div',
              text: {
                content: 'User Agent: ' + window.navigator.userAgent,
                tag: 'plain_text'
              }
            },
            {
              tag: 'div',
              text: {
                content: 'Time: ' + new Date().toString(),
                tag: 'plain_text'
              }
            },
            {
              tag: 'div',
              text: {
                content: `${error.name}: ${error.message}`,
                tag: 'plain_text'
              }
            },
            {
              tag: 'div',
              text: {
                content: `At: ${info.componentStack}`,
                tag: 'plain_text'
              }
            }
          ],
          header: {
            title: {
              tag: 'plain_text',
              content: "Hey, I've caught a bug !"
            }
          }
        }
      })
    });
  }
};

export { reportToLarkBot };

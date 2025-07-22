interface FeedbackOptions {
    // Button props
    sessionId?: string;
    buttonPosition?: string;
    buttonStyle?: string;
    feedbackButtonText?: string;
    hideIcon?: boolean;
    hideMobile?: boolean;
    metadata?: string;
    version?: string;
    // Modal props
    customFont?: boolean;
    emailAddress?: string;
    hideEmail?: boolean;
    hidePrivacyPolicy?: boolean;
    hideRating?: boolean;
    hideScreenshotButton?: boolean;
    isEmailRequired?: boolean;
    modalPosition?: string;
    project?: string;
    rating?: number;
    ratingMode?: string;
    emailPlaceholder?: string;
    errorMessage?: string;
    errorMessage403?: string;
    errorMessage404?: string;
    footerText?: string;
    messagePlaceholder?: string;
    modalTitle?: string;
    modalTitleError?: string;
    modalTitleSuccess?: string;
    privacyPolicyText?: string;
    ratingPlaceholder?: string;
    ratingStarsPlaceholder?: string;
    screenshotButtonText?: string;
    screenshotTopbarText?: string;
    sendButtonText?: string;
    successMessage?: string;
}

const DEFAULT_OPTIONS: FeedbackOptions = {
    feedbackButtonText: 'Feedback',
    modalPosition: "bottom-right",
    buttonStyle: "light",
    buttonPosition: 'bottom-right',
};

function camelToKebab(string: string): string {
    return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

function generateFeedbackScript(options: FeedbackOptions): string {
    const mergedProps: FeedbackOptions = { ...DEFAULT_OPTIONS, ...options };
    const { project, feedbackButtonText, ...feedbackProps } = mergedProps;
    let scriptContent = `
        const feedbackButton = document.createElement('feedback-button');
        feedbackButton.setAttribute('project', '${project || ""}');
    `;

    Object.entries(feedbackProps).forEach(([key, value]) => {
        if (value !== undefined) {
            scriptContent += `
                feedbackButton.setAttribute('${camelToKebab(key)}', '${value.toString()}');
            `;
        }
    });

    scriptContent += `
        feedbackButton.textContent = '${feedbackButtonText || DEFAULT_OPTIONS.feedbackButtonText}';
        document.body.appendChild(feedbackButton);
    `;

    return scriptContent;
}

module.exports = function (_context: any, options: FeedbackOptions) {

    const version = options.version || 'latest'; 
    return {
        name: 'docusaurus-feedback-plugin',

        injectHtmlTags() {
            return {
                headTags: [
                    {
                        tagName: 'link',
                        attributes: {
                            rel: 'stylesheet',
                            href: `https://cdn.jsdelivr.net/npm/pushfeedback@${version}/dist/pushfeedback/pushfeedback.css`,
                        },
                    },
                ],
                postBodyTags: [
                    {
                        tagName: 'script',
                        attributes: {
                            type: 'module',
                            src: `https://cdn.jsdelivr.net/npm/pushfeedback@${version}/dist/pushfeedback/pushfeedback.esm.js`,
                        },
                    },
                    {
                        tagName: 'script',
                        innerHTML: generateFeedbackScript(options),
                    }
                ]
            };
        },
    };
};

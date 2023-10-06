import React, {
	Fragment,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import classNames from 'classnames';

import { mergeConfig } from '../utils/mergeConfig';
import { NiceButton } from '../MigratedUI/NiceButton';
import { NiceText } from '../MigratedUI/NiceText';
// import './index.css';

const DETERMINING_CLASS = 'form-input-v2';

export function CompactForm(props) {
	const { disableFunction = false } = props || {};

	const [canInline, setInlineMode] = useState(true);
	const [loading, setLoading] = useState(false);
	const [currentErrorMap, setCurrentErrorMap] = useState({});

	const formRef = useRef(null);
	const fillVars = mergeConfig(defaultProps, props);
	const seed = useRef(Math.round(Math.random() * 10 ** 9)).current;
	const capchaRef = useRef(null);

	const {
		formName: _formName,
		formEmailTo,
		formRedirectionUrl,
		formShowInputLabel,

		formButtonLabel,
		formMethod,
		formCharset,
		clone1,

		shopEmail,

		spacingBetweenInline,
		spacingBetweenLine,
		containerSpacing,
		inputSpacing,
		textAreaRowLength,
		breakOffPoint,

		labelFontFamily,
		labelFontWeight,
		labelFontSize,
		labelFontColor,
		labelMarginBottom: labelSpacing,

		inputBoxBackgroundColor,
		inputBoxBorderType,
		inputBoxBorderWidth,
		inputBoxBorderColor,
		inputBoxBorderRadius,
		inputBoxMarginBottom,

		placeholderFontWeight,
		placeholderFontSize,
		placeholderFontColor,

		buttonFontColor,
		buttonBackgroundColor,
		buttonHoverFontColor,
		buttonHoverBackgroundColor,
		buttonFontFamily,
		buttonFontWeight,
		buttonFontSize,
		ident_1,
		ident_2,
		isoCode,
		keepSameLocale,
		formType,
		formAdditionalTags,
		_preview = false,
	} = fillVars;

	const localizedMode = !formEmailTo || formEmailTo.trim() === shopEmail;

	const displayFormType = formType === 'customer' ? 'newsletter' : formType;

	// TODO: normalize form name var
	const formName = _formName || displayFormType;

	console.log('t', fillVars);
	console.log(props);

	useEffect(() => {
		const f = () => {
			const width = window.innerWidth;
			setInlineMode(width > breakOffPoint);
		};
		f();
		window.addEventListener('resize', f);
		return () => {
			window.removeEventListener('resize', f);
		};
	}, [setInlineMode]);

	if (!formName) {
		return 'Missing an important part of existence';
	}

	const validateSubmitData = (submitObj) => {
		console.log('data', submitObj);

		if (formRef.current) {
			const allInputs = formRef.current.querySelectorAll('input');
			let validity = true;
			let validationMsg = '';
			let name = '';
			const errorMap = {};

			allInputs.forEach((i) => {
				if (validity && !i.checkValidity()) {
					validity = false;
					if (i.validationMessage) {
						validationMsg = i.validationMessage;
						name = i.name;
						console.log('failed', name, validationMsg);
					}
				}
			});
			if (!validity && validationMsg) {
				if (name) {
					errorMap[name] = validationMsg;

					const matches = name.match(/\[(.*)\]/);
					if (matches && matches.length > 0) {
						const realName = matches[1];
						const target = clone1.find((t) => {
							return (
								t.inputLabel.trim().toLowerCase() ===
								realName.trim().toLowerCase()
							);
						});
						if (target) {
							validationMsg = `${target.inputLabel}: ${validationMsg}`;
						}
					}
				}
			}
			setCurrentErrorMap(errorMap);
			return validity;
		}
		return true;
	};

	const selfIdentName = `TPT_FORM_INSTANCE_${formName}`;

	const remoteReport = async (submitObj) => {
		console.log('Reporting', submitObj);

		const localSave = sessionStorage.getItem(selfIdentName);
		if (localSave && parseInt(localSave) === seed && false) {
			console.log('Submitted');
		} else {
			const emailKey = Object.keys(submitObj).find((t) =>
				t.toLowerCase().includes('[email]'),
			);
			const emailValue = emailKey ? submitObj[emailKey] : '';

			const reportObj = {
				formData: submitObj,
				sentFromEmail: shopEmail,
				sentToEmail: formEmailTo,
				url: window.location.pathname,
				utc: new Date(Date.now()).toUTCString(),
				ident: ident_1,
				formName,
				formType,
				seed,
			};
			if (emailValue) {
				reportObj.email = emailValue;
			}
			const startingBase = _preview
				? new URL(ident_2, window.location.origin).href
				: ident_2;
			const specifiedUrl = './rest/V1/receiveExtEmail';
			const t = _preview
				? new URL(startingBase + specifiedUrl.slice(1))
				: new URL(specifiedUrl, startingBase);
			const uOrigin = t.origin;
			const uPath = t.pathname.replaceAll(/\/\//g, '/');
			const url = new URL(uPath, uOrigin);

			const text = await fetch(url.toString(), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					data: JSON.stringify(reportObj),
				}),
			})
				.then((r) => r.json())
				.then((d) => {
					console.log(d);
					return d;
					// sessionStorage.setItem(selfIdentName, seed)
				})
				.catch((e) => console.warn(e));

			const statusObj = text ? JSON.parse(text) : null;
			if (statusObj.statusText.toLowerCase() !== 'ok') {
				return statusObj.statusText;
			}
			return null;
		}
	};
	const reportingFunc = async function () {
		if (formRef.current) {
			console.log('Form exists');
			const formObj = new FormData(formRef.current);
			const submitObj = {};
			for (const pair of formObj.entries()) {
				submitObj[pair[0]] = pair[1];
			}
			const errorText = await remoteReport(submitObj);
			if (errorText) {
				alert(errorText);
			}
		}
	};
	const extractDataDict = () => {
		const formObj = new FormData(formRef.current);
		const submitObj = {};
		for (const pair of formObj.entries()) {
			submitObj[pair[0]] = pair[1];
		}
		return submitObj;
	};

	const onFormSubmit = async function (event) {
		// event.preventDefault();
		// if (formRef.current) {
		//     console.log('Form exists')
		// }
		if (window.Shopify && formRef.current) {
			window.Shopify.recaptchaV3.addToken(formRef.current, 'customer');
		} else {
			console.warn('Not in Shopify env');
		}
		return false;
	};
	const formConfig = {
		method: formMethod,
		action: `/contact#${formName}`,
		acceptCharset: formCharset,
		onSubmit: onFormSubmit,
	};

	const placeholderStyle = {
		fontWeight: placeholderFontWeight,
		fontSize: placeholderFontSize,
		color: placeholderFontColor,
	};

	const formInputs = clone1
		.filter((config) => {
			if (
				!Object.prototype.hasOwnProperty.call(config, 'displayStatus') ||
				config.displayStatus
			) {
				return true;
			}
		})
		.map((config, index) => {
			const {
				name,
				inputLabel,
				inputType,
				isInputRequired,
				inputPlaceholder,
				isInline,
			} = config;

			const isSecretlyEmail = name.toLowerCase().trim() === 'email';

			const inputStyle = {
				backgroundColor: inputBoxBackgroundColor,
				borderStyle: inputBoxBorderType,
				borderWidth: inputBoxBorderWidth,
				borderColor: inputBoxBorderColor,
				borderRadius: inputBoxBorderRadius,
				marginBottom: inputBoxMarginBottom,
				fontFamily: labelFontFamily,
				padding: `calc(${inputSpacing}*1.3) ${inputSpacing}`,
				fontWeight: labelFontWeight,
				fontSize: labelFontSize,
				color: labelFontColor,
			};

			const target = `contact[${isSecretlyEmail ? 'email' : name}]`;

			const inputRtConfig = {
				key: index,
				className: `resize-vertical-only ${DETERMINING_CLASS}`,
				placeholder: inputPlaceholder,
				name: target,
				style: inputStyle,
				placeholderStyle: placeholderStyle,
				type: inputType,
				rows: textAreaRowLength,
			};
			console.log(target, inputType);

			if (isSecretlyEmail || isInputRequired) {
				inputRtConfig.required = true;
			}

			const isFirstInline = index - 1 < 0 || !isInline;

			const needBreak = !isInline && index > 0;

			const remainingConfigs = clone1.slice(index);
			const isLastLine =
				remainingConfigs.length === 0 ||
				remainingConfigs.every((t) => t.isInline);

			const styles = {
				marginLeft: canInline ? (isFirstInline ? 0 : spacingBetweenInline) : 0,
				marginBottom: isLastLine ? 0 : spacingBetweenLine,
			};

			const labelStyle = {
				marginBottom: labelSpacing,
				fontFamily: labelFontFamily,
				fontWeight: labelFontWeight,
				fontSize: labelFontSize,
				color: labelFontColor,
			};

			const classes = classNames(
				`tpt-input-content tpt-input-content-${index}`,
				{ isFirstInline },
				{ isLastLine },
			);
			const errorText = currentErrorMap[target];
			const isRequired = inputRtConfig.required;

			const checkError = (entry) => {
				if (!entry) {
					return [false, true];
				}
				if (!entry.isInline) {
					return [false, true];
				}
				const isEmail = entry.name.toLowerCase().trim() === 'email';
				const target = `contact[${isEmail ? 'email' : entry.name}]`;
				if (currentErrorMap[target]) {
					return [true];
				}
				return [false];
			};

			const hasNearbyError = (function () {
				for (let i = 1; i < 5; i++) {
					const nextEntry = clone1[index + i];
					const [ok, terminate] = checkError(nextEntry);
					if (ok) {
						return true;
					}
					if (terminate) {
						break;
					}
				}
				for (let i = 0; i > -5; i--) {
					const nextEntry = clone1[index + i];
					const [ok, terminate] = checkError(nextEntry);
					if (ok) {
						return true;
					}
					if (terminate) {
						break;
					}
				}
				return false;
			})();

			return (
				<Fragment key={name}>
					{needBreak && (
						<div className='break'>
							<span />
						</div>
					)}
					<div className={classes} style={styles}>
						{formShowInputLabel && inputLabel && (
							<label htmlFor={target} style={labelStyle}>
								{inputLabel}
								{isRequired && <span className='tpt-required-start'>*</span>}
							</label>
						)}
						<NiceText {...inputRtConfig} />
						{(hasNearbyError || errorText) && (
							<div className='tpt-error-text'>{errorText || <span />}</div>
						)}
					</div>
				</Fragment>
			);
		});

	const containerStyle = {
		padding: `${containerSpacing} calc(${containerSpacing}*1.5)`,
	};

	const buttonStyle = {
		color: buttonFontColor,
		backgroundColor: buttonBackgroundColor,

		fontFamily: buttonFontFamily,
		fontWeight: buttonFontWeight,
		fontSize: buttonFontSize,
	};
	const buttonHoverStyle = {
		color: buttonHoverFontColor,
		backgroundColor: buttonHoverBackgroundColor,
	};

	const abstractFormSubmit = async (e) => {
		if (disableFunction) {
			return false;
		}
		if (loading) {
			return false;
		}
		setLoading(true);
		const formDataDict = extractDataDict();

		if (!validateSubmitData(formDataDict)) {
			console.warn('Validation failed');
			setLoading(false);
			return false;
		} else {
			console.log('Query up');
			const errorText = await remoteReport(formDataDict);

			if (errorText) {
				setLoading(false);
				return alert(errorText);
			}

			if (formRef.current && formRef.current.submit) {
				console.log('submissionxy');

				const phoneInput = formRef.current.querySelector(
					'input[name="contact[phone]"]',
				);

				if (phoneInput) {
					const phoneValue = phoneInput.value;
					const t = document.createElement('input');
					t.type = 'tel';
					t.value = phoneValue;
					t.name = 'contact[note][phone]';
					formRef.current.appendChild(t);
				}

				if (window.grecaptcha) {
					const grecaptchaToken = await window.grecaptcha.execute(
						window.Shopify.recaptchaV3.siteKey,
						{ action: 'submit' },
					);
					capchaRef.current = grecaptchaToken;
					const t = document.createElement('input');
					t.type = 'hidden';
					t.value = grecaptchaToken;
					t.name = 'recaptcha-v3-token';
					formRef.current.appendChild(t);
					console.log('token', grecaptchaToken, formRef.current);
					formRef.current.submit();
				}
			}
		}
	};
	const isAbsoluteUrl = (url) => {
		return url.startsWith('http');
	};

	const returnToValue = useMemo(() => {
		if (!keepSameLocale) {
			return formRedirectionUrl;
		}
		if (formRedirectionUrl) {
			if (!isAbsoluteUrl(formRedirectionUrl)) {
				if (
					isoCode === 'en' ||
					new RegExp(`^/?${isoCode}/`).test(formRedirectionUrl)
				) {
					return formRedirectionUrl;
				} else {
					return `/${isoCode}/` + formRedirectionUrl;
				}
			}
		}
		return '';
	}, [formRedirectionUrl]);

	useLayoutEffect(() => {
		if (formRedirectionUrl) {
			console.log('check redirection', formRedirectionUrl);
			const currentUrl = new URL(location.href);
			if (currentUrl.searchParams.get('customer_posted')) {
				console.log('posted');
				window.location.replace(formRedirectionUrl);
			} else {
				console.log('not posted');
			}
		}
	}, [formRedirectionUrl]);

	const buttonLabel = loading ? 'Loading...' : formButtonLabel;

	const userTags = (function () {
		if (!formAdditionalTags) {
			return [];
		}
		try {
			return formAdditionalTags.split(',').filter(Boolean);
		} catch (e) {
			return [];
		}
	})();

	const tags = Object.keys(
		[displayFormType, formName].reduce((acc, t) => {
			acc[t] = 1;
			return acc;
		}, {}),
	);

	userTags.forEach((t) => {
		if (!tags.includes(t)) {
			tags.push(t);
		}
	});

	const tagVal = tags.join(',');

	return (
		<div className='unique-class-for-form' style={containerStyle}>
			<form
				{...formConfig}
				className={classNames('tpt-form', { notInline: !canInline })}
				ref={formRef}
			>
				<input type='hidden' name='form_type' value={formType} />
				<input type='hidden' name='utf8' value='✓' />
				<input type='hidden' name='contact[tags]' value={tagVal} />

				{returnToValue && (
					<input type='hidden' name='return_to' value={returnToValue} />
				)}
				{formInputs}

				<div className='break'>
					<span />
				</div>

				<div className='form-buttoned'>
					<NiceButton
						type='button'
						style={buttonStyle}
						hoverStyle={buttonHoverStyle}
						onClick={abstractFormSubmit}
					>
						{buttonLabel}
					</NiceButton>
				</div>
			</form>
		</div>
	);
}

const defaultProps = {
	formName: '',
	formType: '',
	formEmailTo: '',
	formRedirectionUrl: null,
	formButtonLabel: 'Submit',

	formMethod: 'POST',
	formCharset: 'UTF-8',

	// TODO: add these to config json
	spacingBetweenInline: '1.2rem',
	spacingBetweenLine: '1.5rem',
	containerSpacing: '10px',
	inputSpacing: '10px',
	textAreaRowLength: 5,
	breakOffPoint: 500,

	labelFontFamily: 'inherit',
	labelFontWeight: 500,
	labelFontSize: '1rem',
	labelFontColor: '#333',
	labelMarginBottom: '10px',

	inputBoxBackgroundColor: 'none',
	inputBoxBorderType: 'solid',
	inputBoxBorderWidth: '1px',
	inputBoxBorderColor: '#3f3f3f3f',
	inputBoxBorderRadius: '5px',
	inputBoxMarginBottom: 0,

	placeholderFontWeight: 400,
	placeholderFontSize: '0.8rem',
	placeholderFontColor: '#74d',

	buttonFontColor: '#fff',
	buttonBackgroundColor: 'salmon',
	buttonHoverFontColor: '#000',
	buttonHoverBackgroundColor: '#3fc',
	buttonFontFamily: 'inherit',
	buttonFontWeight: 500,
	buttonFontSize: '1rem',
	// TODO: add style for button justify

	// clone1: []
	clone1: [
		{
			name: 'Name',
			inputLabel: 'Name',
			isInputRequired: true,
			// "isInline": true
		},
		{
			name: 'Email',
			inputLabel: 'Email',
			inputType: 'email',
			isInline: true,
			inputPlaceholder: '',
			isInputRequired: true,
		},
		{
			name: 'Subject',
			inputLabel: 'Subject',
			inputType: 'text-area',
			inputPlaceholder: '',
		},
		{
			name: 'Message',
			inputLabel: 'Message',
			inputType: 'text-area',
		},
	],
};

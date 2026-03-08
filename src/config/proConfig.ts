export const PRO_CONFIG = {
  proModeEnabled: true,
  proPrice: '$49',
  checkoutUrl:
    'https://kinetic-ui.lemonsqueezy.com/checkout/buy/de3a4156-968f-4fcf-8984-2268110dab85?embed=1',
};

export const isProUnlocked = (): boolean =>
  localStorage.getItem('kinetic_license_status') === 'active';

export const saveLicense = (key: string) => {
  localStorage.setItem('kinetic_license_key', key);
  localStorage.setItem('kinetic_license_status', 'active');
};

export const revokeLicense = () => {
  localStorage.removeItem('kinetic_license_key');
  localStorage.removeItem('kinetic_license_status');
};

export const getLicenseKey = (): string =>
  localStorage.getItem('kinetic_license_key') ?? '';

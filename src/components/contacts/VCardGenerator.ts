// vCard 3.0 Generator for contact export
export interface ContactInfo {
  name: {
    first: string;
    last: string;
    preferred?: string;
  };
  title: string;
  company?: string;
  email: string[];
  phone?: string[];
  website: string;
  location: string;
  social: {
    platform: string;
    url: string;
    handle: string;
  }[];
  bio: string;
  photo: string;
}

export const OFFICIAL_CONTACT: ContactInfo = {
  name: { first: 'OpenClaw', last: 'AI' },
  title: 'Product Builder',
  email: ['ai@openclaw.io'],
  website: 'https://www.openclaw.io',
  location: 'Dublin, Ireland',
  social: [
    { platform: 'github', url: 'https://github.com/openclaw', handle: '@openclaw' },
    { platform: 'linkedin', url: 'https://linkedin.com/company/openclaw', handle: 'openclaw' },
    { platform: 'x', url: 'https://x.com/openclaw', handle: '@openclaw' },
  ],
  bio: 'Part poet, part engineer, part philosopher.',
  photo: '/8gent-logo.png',
};

/**
 * Generates a vCard 3.0 string from contact info
 */
export const generateVCard = (contact: ContactInfo): string => {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${contact.name.last};${contact.name.first};;;`,
    `FN:${contact.name.first} ${contact.name.last}`,
    `TITLE:${contact.title}`,
  ];

  // Add company if present
  if (contact.company) {
    lines.push(`ORG:${contact.company}`);
  }

  // Add emails
  contact.email.forEach((email, index) => {
    const type = index === 0 ? 'WORK' : 'HOME';
    lines.push(`EMAIL;TYPE=${type}:${email}`);
  });

  // Add phones
  if (contact.phone) {
    contact.phone.forEach((phone, index) => {
      const type = index === 0 ? 'CELL' : 'WORK';
      lines.push(`TEL;TYPE=${type}:${phone}`);
    });
  }

  // Add website
  lines.push(`URL:${contact.website}`);

  // Add location (simplified address)
  lines.push(`ADR;TYPE=WORK:;;${contact.location};;;;`);

  // Add bio as note
  lines.push(`NOTE:${contact.bio}`);

  // Add photo URL
  if (contact.photo) {
    // Use absolute URL for the photo
    const photoUrl = contact.photo.startsWith('http')
      ? contact.photo
      : `https://www.openclaw.io${contact.photo}`;
    lines.push(`PHOTO;VALUE=URI:${photoUrl}`);
  }

  // Add social profiles as URLs with labels
  contact.social.forEach((social) => {
    lines.push(`X-SOCIALPROFILE;TYPE=${social.platform}:${social.url}`);
  });

  lines.push('END:VCARD');

  return lines.join('\r\n');
};

/**
 * Triggers download of vCard file
 */
export const downloadVCard = (contact: ContactInfo): void => {
  const vcard = generateVCard(contact);
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${contact.name.first}-${contact.name.last}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
};

/**
 * Generates vCard data URL for QR code
 */
export const getVCardDataUrl = (contact: ContactInfo): string => {
  return generateVCard(contact);
};

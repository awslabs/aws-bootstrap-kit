const DNS_UPDATE_ROLE_SUFFIX = '-dns-update';
export const getDNSUpdateRoleNameFromSubZoneName = (subZoneName: string) => {
  return `${subZoneName}${DNS_UPDATE_ROLE_SUFFIX}`.toLocaleLowerCase();
};

export const getSubdomainPrefix = (accountName: string | undefined, accountStageName: string | undefined) => {
  if (!accountName) {
    throw new Error('accountName needs to be provided. aborting.');
  }
  let prefix: string = accountStageName ? accountStageName : accountName!;
  prefix = prefix.toLowerCase();
  prefix = prefix.replace(' ', '-');
  return prefix;
};


export const getDNSUpdateRoleNameFromServiceRecordName = (serviceRecordName: string) => {
  // Keep only the root domain as it is used for the role name "landingpage.dev.ilovemylocalfarmer.dev".split('.').splice(1).join('.') => 'dev.ilovemylocalfarmer.dev'
  return getDNSUpdateRoleNameFromSubZoneName(serviceRecordName
    .split('.')
    .splice(1)
    .join('.'));
};
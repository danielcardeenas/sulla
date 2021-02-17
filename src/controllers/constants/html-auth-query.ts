export const htmlAuthQuery = `(document.getElementsByClassName('app')[0] &&
document.getElementsByClassName('app')[0].attributes &&
!!document.getElementsByClassName('app')[0].attributes.tabindex) ||
(document.getElementsByClassName('two')[0] &&
document.getElementsByClassName('two')[0].attributes &&
!!document.getElementsByClassName('two')[0].attributes.tabindex)
`;

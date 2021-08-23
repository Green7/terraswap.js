/* blacklist from TerraSwap web app */

import { AssetInfo, isToken } from '../types';

const blacklist: string[] = [
  'terra137qvfdvlkj9vfhrctz4rlkk7lmgql7xalqlwpw', // dummy MIR
  'terra1h4hvry62zk4zh0udecqmatfg02phnyu6hq74xd', // dummy MIR
  'terra1vwvpvamj60rtnzxzr00thgtv5hplhu55jx67d6', // dummy mAAPL
  'terra1gun7mcfjq965gm2jqmq2upxkeqd2lay4qrzfej', // dummy mTWTR
  'terra12lvpnlphqh3q0cxp8y47e5km8k2ad5ydw5asu4', // dummy mIAU
  'terra1tthplnk67e7tvga2dh49jk6l6cn4furuuffu9x', // dummy mAMZN
  'terra1yrch507vhsmd9rue6q3v8pz4pe445jl09nrvz6', // dummy mMSFT
  'terra1uhwhrypcnucvcc2ayt92mlky2xtatslrn7tte4', // dummy mVIXY
  'terra1td527f09l7lgf55fqtr0zvtx5ek0yl0fdrx574', // dummy mSLV
  'terra14xulq5g99rfmrm6qkgzmrrspvknupajdqyd92k', // dummy mBABA
  'terra176eej9z5upauemz7wg2q6n86472xyy836v6smx', // dummy mTSLA
  'terra1cczv3ck2r909w64n9rdqs3gh5gsmwumh4utz49', // dummy mNFLX
  'terra1enj2np0785hw3vt2gn2yga9y75306g6e9lq799', // dummy mQQQ
  'terra1ay3729yle6u6wxj3wcm8racn50a2yq5r8vxvkx', // dummy mUSO
  'terra1hqgzrrtsft73pjnlf7w946u3m70a99cxjjm879', // dummy mGOOGL
  'terra17wgmccdu57lx09yzhnnev39srqj7msg9ky2j76', // dummy BLUNA
  'terra1ky3uafsw2kkddrhm039klksqkuwtdsfsmpc748', // dummy ANC
  'terra1587zn7hagaylrp22x5edz25zpqfn6szfmvtym4', // dummy ANC
  'terra1zp3a6q6q4953cz376906g5qfmxnlg77hx3te45', // delisted mVIXY
  'terra15hp9pr8y4qsvqvxf3m4xeptlk7l8h60634gqec', // delisted mIAU
];

export function isBlacklisted(assetInfo: AssetInfo): boolean {
  return !!(isToken(assetInfo) && blacklist.includes(assetInfo.token.contract_addr));
}

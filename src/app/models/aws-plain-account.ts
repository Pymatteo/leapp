import {AccountType} from './AccountType';

export interface AwsPlainAccount extends Account {
  accountId: number;
  accountName: string;
  accountNumber: string;
  user: string;
  type: AccountType;
}

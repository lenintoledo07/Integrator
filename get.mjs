import * as api from '@protocolink/api';
import * as common from '@protocolink/common';
import 'dotenv/config';

async function main() {
  try {
    const account = process.env.USER_ACCOUNT;
    const tokenIn = common.erc20Tokens.mainnet.USDC;
    const tokenOut = common.etherToken;

    const quotation = await api.quote({
      protocol: 'uniswap-v3',
      chainId: common.ChainId.mainnet,
      tokenIn,
      amountIn: '1000',  // cantidad en la menor unidad de USDC (por ejemplo, 1000 USDC = 1000 * 10^6)
      tokenOut,
      slippage: '1',  // tolerancia al deslizamiento en %
    });

    console.log('Quotation:', quotation);
  } catch (error) {
    console.error('Error:', error);
  }
}

//main();

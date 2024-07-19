import * as api from '@protocolink/api';
import * as common from '@protocolink/common';

const chainId = common.ChainId.mainnet;

const USDC = {
  chainId: 1,
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  decimals: 6,
  symbol: 'USDC',
  name: 'USD Coin',
};
const WBTC = {
  chainId: 1,
  address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  decimals: 8,
  symbol: 'WBTC',
  name: 'Wrapped BTC',
};

const swapQuotation = await api.protocols.uniswapv3.getSwapTokenQuotation(chainId, {
  input: { token: USDC, amount: '1000' },
  tokenOut: WBTC,
  slippage: 100, // 1%
});

const swapLogic = api.protocols.uniswapv3.newSwapTokenLogic(swapQuotation)

TextDecoderStream;
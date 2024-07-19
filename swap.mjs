import * as api from '@protocolink/api';
import * as common from '@protocolink/common';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  try {
    const chainId = common.ChainId.mainnet;

    const USDC = {
      chainId: 1,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin',
    };
    const ETH = {
      chainId: 1,
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      decimals: 18,
      symbol: 'ETH',
      name: 'Ethereum',
    };

    // Obtener cotizaciones de diferentes DEX
    const uniswapQuotation = await api.protocols.uniswapv3.getSwapTokenQuotation(chainId, {
      input: { token: USDC, amount: '1000' },
      tokenOut: ETH,
      slippage: 100,
    });

    const sushiswapQuotation = await api.protocols.sushiswap.getSwapTokenQuotation(chainId, {
      input: { token: USDC, amount: '1000' },
      tokenOut: ETH,
      slippage: 100,
    });

    // Comparar las cotizaciones y seleccionar la mejor
    const bestQuotation = uniswapQuotation.output.amount > sushiswapQuotation.output.amount
      ? uniswapQuotation
      : sushiswapQuotation;

    // Ejecutar la transacción en el DEX seleccionado
    const swapLogic = bestQuotation === uniswapQuotation
      ? api.protocols.uniswapv3.newSwapTokenLogic(uniswapQuotation)
      : api.protocols.sushiswap.newSwapTokenLogic(sushiswapQuotation);

    const routerData = {
      chainId,
      account: process.env.USER_ACCOUNT,
      logics: [swapLogic],
    };

    const transactionRequest = await api.buildRouterTransactionRequest(routerData);
    console.log('Transaction Request:', transactionRequest);
  } catch (error) {
    console.error('Error:', error);
  }
})();

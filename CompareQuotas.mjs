import * as api from '@protocolink/api';
import * as common from '@protocolink/common';
import 'dotenv/config';

async function getQuotations() {
  const account = process.env.USER_ACCOUNT;
  const tokenIn = common.erc20Tokens.mainnet.USDC;
  const tokenOut = common.etherToken;
  const amountIn = '1000';  // Cantidad en la menor unidad de USDC (por ejemplo, 1000 USDC = 1000 * 10^6)
  const slippage = '1';  // Tolerancia al deslizamiento en %

  try {
    // Obtener cotización de Uniswap V3
    const uniswapV3Quotation = await api.quote({
      protocol: 'uniswap-v3',
      chainId: common.ChainId.mainnet,
      tokenIn,
      amountIn,
      tokenOut,
      slippage,
    });

    // Obtener cotización de Sushiswap
    const sushiswapQuotation = await api.quote({
      protocol: 'sushiswap',
      chainId: common.ChainId.mainnet,
      tokenIn,
      amountIn,
      tokenOut,
      slippage,
    });

    return {
      uniswapV3: uniswapV3Quotation,
      sushiswap: sushiswapQuotation
    };
  } catch (error) {
    console.error('Error obteniendo cotizaciones:', error);
  }
}


//async function compareAndSelectBestQuote() {
//    const quotations = await getQuotations();
//    if (!quotations) return;
  
//    const { uniswapV3, sushiswap } = quotations;
//    console.log('Uniswap V3 Quotation:', uniswapV3);
//    console.log('Sushiswap Quotation:', sushiswap);
  
//    const bestQuote = (uniswapV3.amountOut > sushiswap.amountOut) ? uniswapV3 : sushiswap;
//    console.log('Best Quotation:', bestQuote);
//  }
  
//  compareAndSelectBestQuote();
  
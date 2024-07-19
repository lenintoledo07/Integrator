import * as api from '@protocolink/api';
import * as common from '@protocolink/common';
import { expect } from 'chai';

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
    const WBTC = {
      chainId: 1,
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      decimals: 8,
      symbol: 'WBTC',
      name: 'Wrapped BTC',
    };
    const aEthWBTC = {
      chainId: 1,
      address: '0x5Ee5bf7ae06D1Be5997A1A72006FE6C607eC6DE8',
      decimals: 8,
      symbol: 'aEthWBTC',
      name: 'Aave Ethereum WBTC',
    };

    const swapQuotation = await api.protocols.uniswapv3.getSwapTokenQuotation(chainId, {
      input: { token: USDC, amount: '1000' },
      tokenOut: WBTC,
      slippage: 100,
    });

    const swapLogic = api.protocols.uniswapv3.newSwapTokenLogic(swapQuotation);

    const supplyQuotation = await api.protocols.aavev3.getSupplyQuotation(chainId, {
      input: swapQuotation.output,
      tokenOut: aEthWBTC,
    });

    const supplyLogic = api.protocols.aavev3.newSupplyLogic(supplyQuotation);
    supplyLogic.fields.balanceBps = common.BPS_BASE;

    const routerData = {
      chainId,
      account: '0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa',
      logics: [swapLogic, supplyLogic],
    };

    const estimateResult = await api.estimateRouterData(routerData);
    expect(estimateResult).to.include.all.keys('funds', 'balances', 'approvals', 'permitData');
    expect(estimateResult.funds).to.have.lengthOf(1);
    expect(estimateResult.funds.get(USDC).amount).to.be.eq('1000');
    expect(estimateResult.balances).to.have.lengthOf(1);
    expect(estimateResult.balances.get(aEthWBTC).amount).to.be.eq(supplyQuotation.output.amount);
    expect(estimateResult.approvals).to.have.lengthOf(1);

    const permitSig = '0xbb8d0cf3e494c2ed4dc1057ee31c90cab5387b8a606019cc32a6d12f714303df183b1b0cd7a1114bd952a4c533ac18606056dda61f922e030967df0836cf76f91c';
    routerData.permitData = estimateResult.permitData;
    routerData.permitSig = permitSig;

    const transactionRequest = await api.buildRouterTransactionRequest(routerData);
    expect(transactionRequest).to.include.all.keys('to', 'data', 'value');

    console.log('Test passed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
})();

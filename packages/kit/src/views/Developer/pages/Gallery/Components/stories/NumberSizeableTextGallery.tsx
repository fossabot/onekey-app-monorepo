import { NumberSizeableText, SizableText, YStack } from '@onekeyhq/components';
import { numberFormat } from '@onekeyhq/shared/src/utils/numberUtils';

import { Layout } from './utils/Layout';

const NumberSizeableTextGallery = () => (
  <Layout
    description=".."
    suggestions={['...']}
    boundaryConditions={['...']}
    elements={[
      {
        title: 'balance',
        element: (
          <YStack space="$3">
            <NumberSizeableText formatter="balance">1abcd1</NumberSizeableText>
            <SizableText>
              {numberFormat({ value: '1abcd1', formatter: 'balance' })}
            </SizableText>
            <NumberSizeableText formatter="balance">
              564230002184512.1242
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '564230002184512.1242',
                formatter: 'balance',
              })}
            </SizableText>
            <NumberSizeableText formatter="balance">
              39477128561230002184512.1242
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '39477128561230002184512.1242',
                formatter: 'balance',
              })}
            </SizableText>
            <NumberSizeableText formatter="balance">0.0045</NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '0.0045',
                formatter: 'balance',
              })}
            </SizableText>
            <NumberSizeableText formatter="balance">
              0.00000002146
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '0.00000002146',
                formatter: 'balance',
              })}
            </SizableText>
            <NumberSizeableText
              formatter="balance"
              formatterOptions={{
                tokenSymbol: 'ETC',
                showPlusMinusSigns: true,
              }}
            >
              0.0000000214562
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '0.0000000214562',
                formatter: 'balance',
              })}
            </SizableText>
            <NumberSizeableText
              formatter="balance"
              formatterOptions={{
                tokenSymbol: 'USDT',
                showPlusMinusSigns: true,
              }}
            >
              -100.16798000000214562
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '-100.16798000000214562',
                formatter: 'balance',
                formatterOptions: {
                  tokenSymbol: 'USDT',
                  showPlusMinusSigns: true,
                },
              })}
            </SizableText>
            <NumberSizeableText
              formatter="balance"
              formatterOptions={{
                tokenSymbol: 'USDC',
                showPlusMinusSigns: true,
              }}
            >
              202.16798000000214562
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '202.16798000000214562',
                formatter: 'balance',
                formatterOptions: {
                  tokenSymbol: 'USDC',
                  showPlusMinusSigns: true,
                },
              })}
            </SizableText>
            <NumberSizeableText
              formatter="balance"
              subTextStyle={{ color: 'red' }}
            >
              0.00000002146
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '0.00000002146',
                formatter: 'balance',
              })}
            </SizableText>
          </YStack>
        ),
      },
      {
        title: 'price',
        element: (
          <YStack space="$3">
            <NumberSizeableText
              formatter="price"
              formatterOptions={{ currency: '$' }}
            >
              1abcd1
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '1abcd1',
                formatter: 'price',
                formatterOptions: { currency: '$' },
              })}
            </SizableText>
            <NumberSizeableText
              formatter="price"
              formatterOptions={{ currency: '$' }}
            >
              13557362245700035555161495398047413998367933131241010410691763880119784559016062844916472252762015173133555676356423519969743085158179152633859513576266605508375167501289296167138332859964556394542868213514778276007018586151530368896935403362153851120149886761999054463554127943866078939583808923520112330553910779375966862567701643361707370405490856611696753232661556874041759.1242
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value:
                  '13557362245700035555161495398047413998367933131241010410691763880119784559016062844916472252762015173133555676356423519969743085158179152633859513576266605508375167501289296167138332859964556394542868213514778276007018586151530368896935403362153851120149886761999054463554127943866078939583808923520112330553910779375966862567701643361707370405490856611696753232661556874041759.1242',
                formatter: 'price',
                formatterOptions: { currency: '$' },
              })}
            </SizableText>
            <NumberSizeableText
              formatter="price"
              formatterOptions={{ currency: '$' }}
            >
              0.0045
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '0.0045',
                formatter: 'price',
                formatterOptions: { currency: '$' },
              })}
            </SizableText>
            <NumberSizeableText
              formatter="price"
              formatterOptions={{ currency: '$' }}
            >
              0.00000002146
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '0.00000002146',
                formatter: 'price',
                formatterOptions: { currency: '$' },
              })}
            </SizableText>
          </YStack>
        ),
      },
      {
        title: 'priceChange',
        element: (
          <YStack space="$3">
            <NumberSizeableText formatter="priceChange">
              1abcd1
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '1abcd1',
                formatter: 'priceChange',
              })}
            </SizableText>
            <NumberSizeableText formatter="priceChange">
              12312381912937323374.7
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '12312381912937323374.7',
                formatter: 'priceChange',
              })}
            </SizableText>
            <NumberSizeableText formatter="priceChange">
              -0.02
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '-0.02',
                formatter: 'priceChange',
              })}
            </SizableText>
            <NumberSizeableText formatter="priceChange">
              -6218129
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '-6218129',
                formatter: 'priceChange',
              })}
            </SizableText>
          </YStack>
        ),
      },
      {
        title: 'value',
        element: (
          <YStack space="$3">
            <NumberSizeableText
              formatter="value"
              formatterOptions={{ currency: '$' }}
            >
              1abcd1
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '1abcd1',
                formatter: 'value',
                formatterOptions: { currency: '$' },
              })}
            </SizableText>
            <NumberSizeableText
              formatter="value"
              formatterOptions={{ currency: '$' }}
            >
              0.009
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '0.009',
                formatter: 'value',
                formatterOptions: { currency: '$' },
              })}
            </SizableText>
            <NumberSizeableText
              formatter="value"
              formatterOptions={{ currency: '$' }}
            >
              912312381912937323375
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '912312381912937323375',
                formatter: 'value',
                formatterOptions: { currency: '$' },
              })}
            </SizableText>
            <NumberSizeableText
              formatter="value"
              formatterOptions={{ currency: '$' }}
            >
              12312381912937323374.7
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '12312381912937323374.7',
                formatter: 'value',
                formatterOptions: { currency: '$' },
              })}
            </SizableText>
          </YStack>
        ),
      },
      {
        title: 'marketCap / MarketCap / Volume / Liquidty / TVL / TokenSupply',
        element: (
          <YStack space="$3">
            <NumberSizeableText formatter="marketCap">
              1abcd1
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '1abcd1',
                formatter: 'marketCap',
              })}
            </SizableText>
            <NumberSizeableText formatter="marketCap">
              0.125423
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '0.125423',
                formatter: 'marketCap',
              })}
            </SizableText>
            <NumberSizeableText formatter="marketCap">
              22.125423
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '22.125423',
                formatter: 'marketCap',
              })}
            </SizableText>
            <NumberSizeableText formatter="marketCap">
              882134512
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '882134512',
                formatter: 'marketCap',
              })}
            </SizableText>
            <NumberSizeableText formatter="marketCap">
              235002184512.1242
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '235002184512.1242',
                formatter: 'marketCap',
              })}
            </SizableText>
            <NumberSizeableText formatter="marketCap">
              564200002184512.1242
            </NumberSizeableText>
            <SizableText>
              {numberFormat({
                value: '564200002184512.1242',
                formatter: 'marketCap',
              })}
            </SizableText>
          </YStack>
        ),
      },
    ]}
  />
);

export default NumberSizeableTextGallery;

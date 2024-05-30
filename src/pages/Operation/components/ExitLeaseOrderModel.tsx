import { queryProductSelect } from '@/pages/Asset/service';
import { queryUserSelect } from '@/pages/User/service';
import ProForm, {
  ModalForm,
  ProFormDatePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormMoney,
  ProFormRadio,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { useIntl } from '@umijs/max';
import type { FC } from 'react';
import { ProductLeaseItem } from '../data';



type ExitLeaseOrderModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<ProductLeaseItem> | undefined;
  onDone: () => void;
  onSubmit: (values: ProductLeaseItem) => void;
};

const ExitLeaseOrderModel: FC<ExitLeaseOrderModelProps> = (props) => {
  const { done, visible, current, onDone, onSubmit, children } = props;
  const intl = useIntl();

  if (!visible) {
    return null;
  }

  /**
   * 时间差计算
   * @param Time1 对比时间
   * @param Time2 时间 默认现在时刻
   * @returns 对象
   * all:[ 是否未来时间 , 年, 日, 时, 分, 秒]
   */
  const TimeDiff = (Time1: Date | string | number, Time2: Date | null | string | number = null) => {
    let D1: Date = new Date(Time1);
    let D2: Date = Time2 ? new Date(Time2) : new Date();
    let DiffT = Number(D2) - Number(D1);
    let Diff: any = {
      ms: DiffT,
      s: Math.trunc(DiffT / 1000),
      m: Math.trunc(DiffT / 60000),
      h: Math.trunc(DiffT / 3600000),
      d: Math.trunc(DiffT / 86400000),
      y: Math.trunc(DiffT / 31536000000),
      all: [0, 0, 0, 0, 0, 0],
    };
    DiffT = DiffT / 1000;
    if (DiffT < 0) {
      DiffT *= -1;
      Diff.all[0] = 1;
    }
    Diff.all[1] = Math.trunc(DiffT / 31536000);
    if (Diff.all[1]) DiffT -= Diff.all[1] * 31536000;
    Diff.all[2] = Math.trunc(DiffT / 86400);
    if (Diff.all[2]) DiffT -= Diff.all[2] * 86400;
    Diff.all[3] = Math.trunc(DiffT / 3600);
    if (Diff.all[3]) DiffT -= Diff.all[3] * 3600;
    Diff.all[4] = Math.trunc(DiffT / 60);
    if (Diff.all[4]) DiffT -= Diff.all[4] * 60;
    Diff.all[5] = Math.trunc(DiffT);
    return Diff;
  };
  // console.table(
  //   TimeDiff(
  //     '1987-5-8 8:8:8 '
  //   )
  // );

  return (
    <ModalForm<ProductLeaseItem>
      visible={visible}
      title="电动车租赁退租操作"
      className=""
      width={640}
      onFinish={async (values) => {
        onSubmit(values);
      }}
      initialValues={current}
      submitter={{
        render: (_, dom) => (done ? null : dom),
      }}
      trigger={<>{children}</>}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
        bodyStyle: done ? { padding: '72px 0' } : {},
      }}
    >
      <>
        <div className={styles.order}>
          <ProFormDigit name="id" hidden />
          <ProFormDigit name="productLeaseId" hidden initialValue={current?.id} />

          <ProForm.Group title="基础数据">
            <ProFormSelect
              name="product"
              width="md"
              fieldProps={{
                labelInValue: true,
              }}
              label="电动车编号"
              placeholder="请选择电动车编号"
              request={async () => {
                return queryProductSelect({
                  current: 1,
                  pageSize: 1000,
                  category: 'ELECTRIC',
                  state: 'STORE',
                }).then(({ data }) => {
                  return data.map((item) => {
                    return {
                      label: item.number + '-' + item.brand.name,
                      value: item.value,
                    };
                  });
                });
              }}
              readonly
            />
            <ProFormSelect
              name="leaseUser"
              width="md"
              fieldProps={{
                labelInValue: true,
              }}
              label="租赁人"
              placeholder="请选择租赁人"
              request={async () => {
                return queryUserSelect({
                  current: 1,
                  pageSize: 1000,
                  type: 'USER',
                }).then(({ data }) => {
                  return data.map((item) => {
                    return {
                      label: item.username + '-' + item.nick,
                      value: item.value,
                      id: item.id,
                    };
                  });
                });
              }}
              readonly
            />

            <ProFormDatePicker name="endTime" label="到期时间" readonly />
          </ProForm.Group>

          <ProForm.Group title="计费数据">
            <ProFormRadio.Group
              name="payType"
              label="计费方式"
              options={[
                {
                  label: '按天计费',
                  value: 'DAY',
                },
                {
                  label: '按月计费',
                  value: 'MONTH',
                },
              ]}
              width="xs"
              readonly
            />

            <ProFormDigit
              name="price"
              label="单价(元)"
              width="xs"
              fieldProps={{ addonAfter: '元' }}
              readonly
            />

            <ProFormDigit
              name="deposit"
              label="保证金(元)"
              width="xs"
              fieldProps={{ addonAfter: '元' }}
              readonly
            />
          </ProForm.Group>
          <ProFormSelect
            name="state"
            width="xs"
            label="状态"
            options={[
              {
                label: '退租完成',
                value: 'FINISH',
              },
              {
                label: '租赁中',
                value: 'NORMAL',
              },
              {
                label: '已逾期',
                value: 'LATE',
              },
            ]}
            hidden
          />

          <ProFormSelect
            hidden
            name="action"
            initialValue={'EXITLEASE'}
            // options={[
            //   {
            //     label: '续租',
            //     value: 'RENEWAL',
            //   },
            //   {
            //     label: '退租',
            //     value: 'EXITLEASE',
            //   },
            // ]}
          />

          <ProFormDigit
            name="amount"
            initialValue={0}
            label="车损及折旧扣除金额"
            rules={[
              {
                required: true,
              },
            ]}
            width="xs"
            fieldProps={{ addonAfter: '元' }}
          />

          <ProFormDependency name={['amount', 'deposit', 'endTime', 'payType', 'price']}>
            {({ amount, deposit, endTime, payType, price }) => {
              //计算需要退还的金额
              //1.计算时间(天/月)
              let days = TimeDiff(endTime).all[2]; //获取天数

              //如何时间小于当前时间已经逾期为负数
              if (endTime < new Date()) {
                days = -days;
              }
              //2.计算金额
              let diffAmount = 0;
              if (payType === 'DAY') {
                diffAmount = days * price;
              } else {
                diffAmount = days * (price / 30);
              }
              const exitAmount = deposit - amount + diffAmount;
              return (
                <>
                  <ProFormMoney
                    name="exitAmount"
                    initialValue={0}
                    label="计算实际退款"
                    fieldProps={{ addonAfter: '元', value: exitAmount, size: 'large' }}
                    readonly
                  />

                  <ProFormTextArea
                    name="inro"
                    label="车辆费用计算及备注"
                    width="md"
                    fieldProps={{
                      value: `电动车租赁${days > 0 ? '剩余' : '逾期'}${days}天，${
                        days > 0 ? '退款' : '扣除'
                      }${diffAmount}元，退回保证金${deposit}元，车损及折旧扣除金额${amount}元，实际退款${exitAmount}元。`,
                    }}
                  />

                  {/* <ProFormTextArea
                    name="inro"
                    label="其他备注说明"
                    placeholder="其他备注说明"
                    width="md"
                  /> */}
                </>
              );
            }}
          </ProFormDependency>
        </div>
      </>
    </ModalForm>
  );
};
export default ExitLeaseOrderModel;

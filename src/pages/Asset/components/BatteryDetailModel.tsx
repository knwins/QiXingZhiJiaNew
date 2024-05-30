import ProForm, {
  ModalForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { type FC } from 'react';
import { BatteryDetailItem } from '../data';
import './style.less';
type BatteryDetailModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<BatteryDetailItem> | undefined;
  onDone: () => void;
};

const BatteryDetailModel: FC<BatteryDetailModelProps> = (props) => {
  const { done, visible, current, onDone } = props;

  if (!visible) {
    return null;
  }

  var voltages = [];
  var i = 1;
  var battryImg = '/battry_blue.png';
  var numColor = 'num';
  var minCount = 0;
  var maxCount = 0;
  for (let item of current?.coreVoltagesArry || []) {
    if (item === current?.minCoreVoltage && minCount < 1) {
      battryImg = '/battry_green.png';
      numColor = 'num num-max';
      minCount++;
    } else if (item === current?.maxCoreVoltage && maxCount < 1) {
      battryImg = '/battry_green.png';
      numColor = 'num num-max';
      maxCount++;
    } else {
      battryImg = '/battry_blue.png';
      numColor = 'num';
    }

    voltages.push(
      <div className="battery-wrap">
        <div className={numColor}>
          <span>{i}</span>
        </div>
        <div className="battery">
          <div className="img_wrap">
            <img src={battryImg}></img>
            <div className="number">{item}V</div>
          </div>
        </div>
      </div>,
    );
    i++;
  }

  return (
    <ModalForm<BatteryDetailItem>
      visible={visible}
      title={current.number}
      width={640}
      initialValues={current}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
        bodyStyle: done ? { padding: '72px 0' } : {},
      }}
      submitter={{ submitButtonProps: { style: { display: 'none' } } }}
    >
      <>
        <ProForm.Group title="时间信息">
          <ProFormDateTimePicker name="readTime" label="读取时间" readonly />
          <ProFormDateTimePicker name="updateTime" label="GPS最后更新时间" readonly />
        </ProForm.Group>

        <ProForm.Group title="状态数据">
          <ProFormText name="serviceState" label="业务状态" readonly />
          <ProFormText name="state" label="电池状态" readonly />
          <ProFormText name="controllerState" label="电池控制状态" readonly />
        </ProForm.Group>

        <ProForm.Group title="基础数据">
          <ProFormSelect name="soc" width="md" label="SOC(%)" readonly />
          <ProFormSelect name="mileage" width="md" label="GPS里程(公里)" readonly />
          <ProFormSelect name="cycleNumbers" width="md" label="循环次数" readonly />
          <ProFormSelect name="runningDays" width="md" label="运行天数" readonly />
        </ProForm.Group>

        {current?.coreVoltagesArry != null ? (
          <>
            <ProForm.Group title="电芯数据">
              <div className="volage-box">
                <div className="volage-title">
                  <div className="title-left">电池单体电压</div>
                  <div style={{ width: 33 }}></div>
                  <div className="max">
                    <div className="dot"></div>
                    <div style={{ width: 5 }}></div>
                    <span>极值</span>
                  </div>
                  <div style={{ width: 20 }}></div>
                  <div className="volage-zhu">压差:{current?.subtractCoreVoltage} V</div>
                </div>
                <div className="voltage-list">{voltages}</div>
              </div>
            </ProForm.Group>
          </>
        ) : (
          ''
        )}

        <ProForm.Group title="其他数据">
          <ProFormSelect name="totalVoltage" width="md" label="总电压(V)" readonly />
          <ProFormSelect name="totalCurrent" width="md" label="总电流(A)" readonly />
          <ProFormSelect name="balanceCurrent" width="md" label="剩余容量(Ah)" readonly />
          <ProFormSelect name="totalDisCharge" width="md" label="总放电(Ah)" readonly />
          <ProFormSelect name="totalCharge" width="md" label="总充电(Ah)" readonly />
        </ProForm.Group>

        {current?.tipMessage ? (
          <>
            <ProFormText name="tipMessage" width="md" label="异常数据" readonly />          </>
        ) : (
          ''
        )}

        <ProFormSelect name="address" width="md" label="最新位置信息" readonly />
      </>
    </ModalForm>
  );
};
export default BatteryDetailModel;

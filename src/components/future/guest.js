import React from "react";
import classNames from "classnames";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import styles from "./guest_style";
import WarnIcon from "@material-ui/icons/Warning";
import {
  // Stepper,
  Button,
  Radio,
  Checkbox,
  StepConnector,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";

function lang(key) {
  const l = window.WEB_LOCALES_ALL || {};
  return key && l[key] ? l[key] : key;
}

class OptionGuest extends React.Component {
  constructor() {
    super();
    this.state = {
      activeStep: 0,
      answer: [0, 0, 0, 0, 0, 0], //0没选 1选了第一个 2选了第二个
      checkrule: false,
      checkRuleTip: false,
    };
    this.rightAnswer = [2, 1, 1, 2, 1, 1];
    this.handleBack = this.handleBack.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleChangeBox = this.handleChangeBox.bind(this);
    this.handleChangeRadio = this.handleChangeRadio.bind(this);
  }

  lang(str) {
    if (!str) return "";
    return this.props.intl.formatMessage({ id: str });
  }

  getSteps() {
    return [
      this.lang("了解规则"),
      this.lang("通过测试"),
      this.lang("开通权限"),
    ];
  }

  getStepContent(step) {
    const c = this.props.classes;
    const { hasError, answer, checkrule, checkRuleTip } = this.state;
    switch (step) {
      case 0:
        return [
          <div>
            <h1 className={c.title}>{this.lang("开通交易")}</h1>
            <p className={c.tip}>
              {this.lang(
                "亲爱的用户，为了保证您接下来更好的控制资金风险，您需要了解以下规则，才能开通交易。"
              )}
            </p>
          </div>,
          <div className={c.knowledge}>
            <div>
              <h3>{lang("future.t.1")}</h3>
              <p>{lang("future.p.1")}</p>
              <p>{lang("future.p.2")}</p>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell width={240}>{lang("future.tab.1")}</TableCell>
                    <TableCell>{lang("future.tab.2")}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell width={240}>{lang("future.tab.3")}</TableCell>
                    <TableCell>{lang("future.tab.4")}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell width={240}>{lang("future.tab.5")}</TableCell>
                    <TableCell>{lang("future.tab.6")}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell width={240}>{lang("future.tab.7")}</TableCell>
                    <TableCell>{lang("future.tab.8")}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell width={240}>{lang("future.tab.9")}</TableCell>
                    <TableCell>{lang("future.tab.10")}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell width={240}>{lang("future.tab.11")}</TableCell>
                    <TableCell>{lang("future.tab.12")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div>
              <h3>{lang("future.t.2")}</h3>
              <p>{lang("future.p.3")}</p>
              <p>{lang("future.p.4")}</p>
              <p>{lang("future.p.5")}</p>
            </div>
            <div>
              <h3>{lang("future.t.3")}</h3>
              <p>
                {lang("future.p.6")}
                <br />
                {lang("future.p.7")}
                <br />
                {lang("future.p.8")}
                <br />
                {lang("future.p.9")}
                <br />
                {lang("future.p.10")}
                <br />
                {lang("future.p.11")}
              </p>
              <p>
                {lang("future.p.12")}
                <br />
                {lang("future.p.13")}
                <br />
                {lang("future.p.27")}
                <br />
                {lang("future.p.28")}
                <br />
                {lang("future.p.29")}
                <br />
                {lang("future.p.30")}
              </p>
            </div>
            <div>
              <h3>{lang("future.t.4")}</h3>
              <p>
                {lang("future.p.14")}
                <br />
                {lang("future.p.15")}
              </p>
              <p>
                {lang("future.p.16")}
                <br />
                {lang("future.p.17")}
                <br />
                {lang("future.p.18")}
              </p>
            </div>
            <div>
              <h3>{lang("future.t.5")}</h3>
              <p>{lang("future.p.19")}</p>
            </div>
            <div>
              <h3>{lang("future.t.6")}</h3>
              <p>
                {lang("future.p.20")}
                <br />
                {lang("future.p.21")}
              </p>
            </div>
            <div>
              <h3>{lang("future.t.7")}</h3>
              <p>{lang("future.p.22")}</p>
              <p>{lang("future.p.23")}</p>
              <p>{lang("future.p.24")}</p>
              <p>{lang("future.p.25")}</p>
            </div>
            <div>
              <h3>{lang("future.t.8")}</h3>
              <p>{lang("future.p.26")}</p>
            </div>
          </div>,
        ];
      case 1:
        return [
          <div>
            <h1 className={c.title}>{this.lang("永续合约测试")}</h1>
            <p className={c.tip}>
              {this.lang(
                "亲爱的用户，为了保证您接下来更好的控制资金风险，您需要了解以下规则，才能开通交易。"
              )}
            </p>
          </div>,
          <div className={c.question}>
            <div
              className={classNames({
                [c.errorTip]: hasError && answer[0] != this.rightAnswer[0],
              })}
            >
              <h3>1. {lang("future.guest.1.q")}</h3>
              <Radio
                color="primary"
                onChange={this.handleChangeRadio}
                value={1}
                name="answer1"
                checked={answer[0] == 1}
              />
              <b>{lang("future.guest.1.a")}</b>
              <br />
              <Radio
                color="primary"
                onChange={this.handleChangeRadio}
                value={2}
                name="answer1"
                checked={answer[0] == 2}
              />
              <b>{lang("future.guest.1.b")}</b>
            </div>
            <div
              className={classNames({
                [c.errorTip]: hasError && answer[1] != this.rightAnswer[1],
              })}
            >
              <h3>2. {lang("future.guest.2.q")}</h3>
              <Radio
                color="primary"
                onChange={this.handleChangeRadio}
                value={1}
                name="answer2"
                checked={answer[1] == 1}
              />
              <b>{lang("future.guest.2.a")}</b>
              <br />
              <Radio
                color="primary"
                onChange={this.handleChangeRadio}
                value={2}
                name="answer2"
                checked={answer[1] == 2}
              />
              <b>{lang("future.guest.2.b")}</b>
            </div>
            <div
              className={classNames({
                [c.errorTip]: hasError && answer[2] != this.rightAnswer[2],
              })}
            >
              <h3>3. {lang("future.guest.3.q")}</h3>
              <Radio
                color="primary"
                onChange={this.handleChangeRadio}
                value={1}
                name="answer3"
                checked={answer[2] == 1}
              />
              <b>{lang("future.guest.3.a")}</b>
              <br />
              <Radio
                color="primary"
                onChange={this.handleChangeRadio}
                value={2}
                name="answer3"
                checked={answer[2] == 2}
              />
              <b>{lang("future.guest.3.b")}</b>
            </div>
            <div
              className={classNames({
                [c.errorTip]: hasError && answer[3] != this.rightAnswer[3],
              })}
            >
              <h3>4. {lang("future.guest.4.q")}</h3>
              <Radio
                color="primary"
                onChange={this.handleChangeRadio}
                value={1}
                name="answer4"
                checked={answer[3] == 1}
              />
              <b>{lang("future.guest.4.a")}</b>
              <br />
              <Radio
                color="primary"
                onChange={this.handleChangeRadio}
                value={2}
                name="answer4"
                checked={answer[3] == 2}
              />
              <b>{lang("future.guest.4.b")}</b>
            </div>
            <div
              className={classNames({
                [c.errorTip]: hasError && answer[4] != this.rightAnswer[4],
              })}
            >
              <h3>5. {lang("future.guest.5.q")}</h3>
              <Radio
                color="primary"
                onChange={this.handleChangeRadio}
                value={1}
                name="answer5"
                checked={answer[4] == 1}
              />
              <b>{lang("future.guest.5.a")}</b>
              <br />
              <Radio
                color="primary"
                onChange={this.handleChangeRadio}
                value={2}
                name="answer5"
                checked={answer[4] == 2}
              />
              <b>{lang("future.guest.5.b")}</b>
            </div>
            <div
              className={classNames({
                [c.errorTip]: hasError && answer[5] != this.rightAnswer[5],
              })}
            >
              <h3>6. {lang("future.guest.6.q")}</h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "10px 0 0",
                }}
              >
                <Radio
                  color="primary"
                  onChange={this.handleChangeRadio}
                  value={1}
                  name="answer6"
                  checked={answer[5] == 1}
                />
                <b>{lang("future.guest.6.a")}</b>
              </div>
              <br />
              <Radio
                color="primary"
                onChange={this.handleChangeRadio}
                value={2}
                name="answer6"
                checked={answer[5] == 2}
              />
              <b>{lang("future.guest.6.b")}</b>
            </div>
          </div>,
        ];
      case 2:
        return [
          <div>
            <h1 className={c.title}>{this.lang("开通交易")}</h1>
            <p className={c.tip}>
              {this.lang(
                "亲爱的用户，为了保证您接下来更好的控制资金风险，您需要了解以下规则，才能开通交易。"
              )}
            </p>
          </div>,
          <div className={c.finish}>
            <img src={require("../../assets/dianzan@2x.png")} />
            <h1
              dangerouslySetInnerHTML={{
                __html: this.lang("恭喜您通过答题，快去开通交易吧!"),
              }}
            ></h1>
            {this.props.index_config &&
            this.props.index_config.userFuturesAgreement ? (
              <p>
                <Checkbox
                  color="primary"
                  checked={checkrule}
                  onChange={this.handleChangeBox}
                />
                <span
                  className={classNames({
                    [c.noticeTip]: checkRuleTip && !checkrule,
                  })}
                >
                  {this.lang("我已阅读并同意")}
                </span>{" "}
                <a
                  className={c.link}
                  href={this.props.index_config.userFuturesAgreement}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {this.lang("《用户使用协议》")}
                </a>
              </p>
            ) : (
              ""
            )}
          </div>,
        ];
      default:
        return "";
    }
  }

  handleBack = () => {
    this.setState((state) => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleNext = () => {
    this.finish();
    return;
    const { activeStep, checkrule } = this.state;
    if (activeStep == 2) {
      if (
        checkrule ||
        !(
          this.props.index_config &&
          this.props.index_config.userFuturesAgreement
        )
      ) {
        this.finish();
      }
      this.setState({
        checkRuleTip: !checkrule,
      });
      return;
    }
    if (activeStep == 1) {
      let hasError = false;
      this.rightAnswer.map((o, i) => {
        let re = o == this.state.answer[i];
        if (!re) hasError = true;
        return re;
      });
      this.setState({
        hasError: hasError,
      });
      if (hasError) return;
    }

    this.setState({
      activeStep: activeStep + 1,
    });
  };

  handleChangeRadio(e) {
    const index = e.target.name.split("answer")[1] - 1;
    const answer = this.state.answer;
    answer[index] = e.target.value;
    this.setState({
      answer: answer,
    });
  }

  handleChangeBox(e) {
    this.setState({
      checkrule: e.target.checked,
    });
  }

  finish() {
    this.props.dispatch({
      type: "future/openFuture",
    });
  }

  componentDidMount() {
    this.props.dispatch({
      type: "future/fetchIfOpenedFuture",
    });
  }

  render() {
    const c = this.props.classes;
    const steps = this.getSteps();
    const { activeStep, hasError } = this.state;
    const connector = (
      <StepConnector
        classes={{
          active: c.connectorActive,
          completed: c.connectorCompleted,
          disabled: c.connectorDisabled,
          line: c.connectorLine,
        }}
      />
    );
    return (
      <div className={c.container}>
        <div className={c.header}>{this.getStepContent(activeStep, c)[0]}</div>

        {/* <div className={c.steper}>
          <Stepper
            className={c.steperRoot}
            activeStep={activeStep}
            connector={connector}
          >
            {steps.map((label, index) => {
              return (
                <Button
                  className={c.steperName}
                  variant="contained"
                  key={index}
                  color={"primary"}
                >
                  {label}
                </Button>
              );
            })}
          </Stepper>
        </div> */}

        {hasError ? (
          <div className={c.error}>
            <span>
              <WarnIcon />
              {this.lang("您有题答错了，请修改后重新提交")}
            </span>
          </div>
        ) : null}

        <div className={c.content}>{this.getStepContent(activeStep, c)[1]}</div>

        <div
          className={classNames(c.buttons, { [c.centerBtn]: activeStep === 2 })}
        >
          {activeStep == 1 ? (
            <Button
              disabled={activeStep === 0 || activeStep == 2}
              onClick={this.handleBack}
              className={classNames(c.button, c.firstBtn)}
            >
              {this.lang("上一步")}
            </Button>
          ) : null}
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleNext}
            className={c.button}
          >
            {activeStep === 0 ? this.lang("开始交易") : null}
            {activeStep === 1 ? this.lang("提交答案") : null}
            {activeStep === 2 ? this.lang("开始交易") : null}
          </Button>
        </div>
        {activeStep === 2 &&
        this.props.index_config &&
        this.props.index_config.futuresCustomerService ? (
          <div className={c.service}>
            <img src={this.props.index_config.futuresCustomerService} />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(OptionGuest));

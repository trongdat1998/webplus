import React from "react";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import styles from "./index_style";

// import { Button } from "@material-ui/core";
const Banner = props => {
  const c = props.classes;
  const lang = str => {
    if (!str) return "";
    return props.intl.formatMessage({ id: str });
  };

  return (
    <div
      className={c.banner}
      style={{
        backgroundImage: `url('${require("../../assets/coinplus_banner@2x.jpg")}'`
      }}
    >
      <div className={c.absolute}>
        <div className={c.bannerContent}>
          <div>
            <h2>{lang("活期投资")}</h2>
          </div>
          <div className={c.line}>
            <h4>{lang("按日计息")}</h4>

            <h4>{lang("灵活投资")}</h4>

            <h4>{lang("随存随取")}</h4>
          </div>
          {/* <div>
            <a target="_blank" href="/">
              <Button className={c.button} variant="outlined" color="primary">
                {lang("查看详情")}
              </Button>
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(injectIntl(Banner));

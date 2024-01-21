import React from "react";
import helper from "../../utils/helper";
import styles from "./style";
import { withStyles } from "@material-ui/core/styles";

class NoAccess extends React.Component {
  constructor() {
    super();
    this.state = {
      
    };
  }
  componentDidMount() {
    setTimeout(() => {
        const dom = window.document.querySelector("#_g_mask");
        dom && (dom.style.display = "none");
    }, 200);
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.access}>
        <div className={classes.content}>
            {/* <img src={this.props.index_config.logo}/> */}
            <div
                dangerouslySetInnerHTML={{
                    __html: helper.dataReform(
                        window.WEB_CONFIG.riskIpDisabled && window.WEB_CONFIG.riskIpDisabled.description
                        ? window.WEB_CONFIG.riskIpDisabled.description.replace(/<script>|<\/script>/gi, "")
                        : ""
                    )
                }}
            />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(NoAccess);

import React from "react";
import styles from "./style";
import { withStyles } from "@material-ui/core/styles";

class Agreement extends React.Component {
  constructor() {
    super();
    this.state = {
      title: {
        "zh-cn": "点卡服务协议",
        "en-us": "Point Card Service Agreement"
      },
      content: {
        "zh-cn": `
<br/>【首部及导言】
<br/>欢迎您使用点卡服务！
<br/>为使用点卡服务（简称为：本服务），您应当阅读并遵守《点卡服务协议》（简称为：本协议）。请您务必审慎阅读、充分理解各条款内容，特别是免除或限制责任的相应条款，以及开通或使用某项服务的单独协议，并选择接受或不接受。
<br/>除非您已阅读并接受本协议所有条款，否则您无权使用本服务。您对本服务的任何购买或接受赠与等获取行为及登录、查看等任何使用行为即视为您已阅读并同意本协议的约束。
<br/>如果您的相关法律行为能力受限，请在监护人的陪同下阅读本协议。

<br/>一、【协议的范围】
<br/>1.1【协议适用主体范围】
<br/>本协议是您与本网站之间关于您使用本服务所订立的协议。
<br/>1.2【本服务内容】
<br/>本协议从属于本网站用户协议，您点击 “已阅读并同意”按钮时表明您已经完全接受包括本网站用户协议、本协议，以及本网站已经发布的或将来可能发布的各类规则、声明、说明等构成的全部条款。
<br/>本协议内容同时包括本网站可能不断发布的关于本服务的相关协议、业务规则等内容。上述内容一经正式发布，即为本协议不可分割的组成部分，您同样应当遵守。

<br/>二、【关于本服务】
<br/>点卡套餐服务，指按照本网站的指定方式和规则，兑换成点卡之后，用户可以享有由本网站或今后可能的其他第三方提供的在本网站上的特定功能的服务（简称为：本服务）。
<br/>本网站可能会根据不同的产品及服务类型，推出不同的点卡服务。目前，本网站提供购买点卡送BHT、默认使用点卡支付币币交易手续费等服务，未来将会开放点卡转让服务。点卡为虚拟物品，一经出售，概不退还。平台点卡的手续费抵扣价值与BTC锚定，每10000点抵扣1BTC等值交易手续费，当点卡用于抵扣其他币种的手续费时，会根据市场价格折算为BTC后扣除相应的点卡。同时，本网站也可能会根据用户的需求、产品及服务类型的变化等，对现有服务种类进行调整以及不断推出新的服务种类。本网站也可能会在不同时间推出具体不同的服务内容，以不断完善、优化本服务。具体服务种类、服务内容、服务规则以相关服务页面公布、实际提供的内容为准。您可以自行根据需要选择相应服务。
<br/>
<br/>三、特别声明
<br/>您充分了解并同意，由于互联网服务的特殊性，本网站可能会按照相关法规、双方约定或在其他必要时，中止或终止向您提供本服务，届时，本网站会依法保护您的合法权益。

<br/>四、违约责任
<br/>    4.1 本网站或用户违反本协议的约定即构成违约，违约方应当向守约方承担违约责任。
<br/>    4.2 如因用户违反法律法规规定或本协议约定，在本网站或利用本网站服务从事非法活动的，本网站有权立即终止继续对其提供本网站服务，注销其账号，并要求其赔偿由此给本网站造成的损失。
<br/>    4.3 如用户以技术手段干扰本网站的运行或干扰其他用户对本网站使用的，本网站有权立即注销其本网站账号，并有权要求其赔偿由此给本网站造成的损失。
<br/>    4.4 如用户以虚构事实等方式恶意诋毁本网站的商誉，本网站有权要求用户向本网站公开道歉，赔偿其给本网站造成的损失，并有权终止对其提供本网站服务。
<br/>
<br/>五、争议解决
<br/>用户与本网站因本协议的履行发生争议的应通过友好协商解决，协商解决不成的，任一方有权将争议提交新加坡国际仲裁中心依据该会仲裁规则进行仲裁。
<br/>
<br/>六、其他
<br/>    6.1 【条款标题】本协议所有条款的标题仅为阅读方便，本身并无实际涵义，不能作为本协议涵义解释的依据。
<br/>    6.2 【可分割条款】本协议条款无论因何种原因部分无效或不可执行，其余条款仍有效，对双方具有约束力。
<br/>    6.3 【未约定事项】本协议未约定内容参照用户协议内容执行。

<br/>  `,
        "en-us": `

<br/>[Preamble]
<br/>Welcome to use our Point Card Services!
<br/>In order to access the point card services (hereinafter referred to as “the Services”), please read and comply with the Point Card Services Agreement (hereinafter referred to as “this Agreement”). You are hereby advised to carefully read and fully understand the terms and conditions of this Agreement, particularly the terms and conditions concerning exemption or limitation of liability, as well as any separate agreement concerning the activation or use of any specific service, and choose whether to accept such terms, conditions and agreements or not.
<br/>You may not access the Services unless and until you read and accept all the terms and conditions of this Agreement. Your acquisition of the Services, whether in the form of purchase or donation or otherwise, or your login, access and any other similar act shall be deemed as indication that you have read and agreed to be bound by this Agreement.
<br/>If your relevant legal capacity is limited, please read this Agreement in the presence of your legal guardian.
<br/> 
<br/>1. Scope of Agreement
<br/>1.1 Scope of Subjects to Whom This Agreement Is Applicable
<br/>This Agreement is entered into by and between you and this Website in connection with your use of the Services hereunder.
<br/>1.2 Preconditions of the Services
<br/>This Agreement is subject to the User Agreement of this Website. Upon your clicking on the button “Read and Accept”, you shall be deemed as having fully accepted all the terms and conditions of the User Agreement of this Website and this Agreement, as well as any existing or future rules, statements, descriptions, etc that this Website has issued or may issue in the future.
<br/>This Agreement also includes relevant agreements and business rules concerning the Services hereunder that this Website may release from time to time. Upon their official release, the aforementioned rules and agreements shall become an integral part of this Agreement and you shall comply with them as such.
<br/> 
<br/>2. About the Services
<br/>The Point Card Services refer to the Services through which the User may, upon conversion into Point Cards in the manner designated by this Website and in accordance with the rules of this Website, access specific functions on this Website that are either provided by this Website or any possible future third party (hereafter referred to as “the Services”).
<br/>The Point Card Services offered by this Website may vary depending on the type of the corresponding products and services in question. Currently our platform provides functions including: Reward BHT when purchases Point Card; Paying trading fee with Point Card by default. In the future, the platform will open up Point Card transferring function. Point Card is treated as a virtual product, and once sold it will not be refundable under all circumstances. The trading fee deduction value when using Point Card is strictly pegged to BTC, meaning 10,000 Pts is equivalent to 1BTC worth of trading fee. When Point Card is used to deduct trading fees for other token, the platform will first convert the relevant token into BTC and then apply the same standards mentioned above. Furthermore, this Website may adjust the existing types of Services and launch new types of Services from time to time and at any time, in light of the user’ needs, and changes in products and service types. This Website may also launch specific and different services at different times, so as to continuously improve and optimize the Services. The exact types, content, and rules of the Services hereunder shall be subject to the information released on relevant Services web-pages and shall be provided or offered on an as-is basis. You may choose the Services according to your need and at your sole discretion.
<br/> 
<br/>3. Special Reminder
<br/>You fully understand and agree that due to the particular nature of Internet services, this Website may suspend or terminate its supply of the Services to you, as may be required by any of the applicable laws and regulations, agreements by and between you and this Website, or as may be otherwise necessary, and in this case, this Website will protect your lawful rights and interests in accordance with law.
<br/> 
<br/>4. Liability for Breach of Agreement
<br/>4.1 Any breach of any term or condition of this Agreement by this Website or by the User shall constitute a breach of this Agreement, and the breaching party shall be liable for such breach of agreement to the observant party.
<br/>4.2 Where the User engages in any illegal activity on or through this Website or any of the Services, and thus violates any applicable law or administrative regulation or breaches this Agreement, this Website shall have the right to promptly terminate the Services provided to such User, cancel the account thereof, and require the User to indemnify this Website against any and all the losses that this Website may sustain therefrom.
<br/>4.3 Where any User interferes with the operation of this Website by any technical means or otherwise interferes with any other user’s use of this Website, this Website shall have the right to promptly cancel the account of the User and shall have the right to require such User to indemnify this Website against any and all losses that it may sustain therefrom.
<br/>4.4 If the User maliciously damages the goodwill of this Website by making up fictional facts or otherwise, this Website shall have the right to demand the User to present a public apology to this Website, and indemnify this Website against any and all losses that it may sustain, and this Website shall have the right to terminate the supply of the Services to the User.
<br/> 
<br/>5. Dispute Resolution
<br/>The User and this Website shall first seek to resolve any dispute that may arise between them in connection with the performance of this Agreement through friendly negotiation. Where the negotiation fails, either party hereto shall have the right to submit such dispute to the Singapore International Arbitration Center for arbitration in accordance with the then applicable arbitration rules thereof.
<br/> 
<br/>6. Miscellaneous
<br/>6.1 Headings. The headings used in this Agreement are for convenience of reference only and shall have no force or effect upon the construction or interpretation of any provision hereof.
<br/>6.2 Severability. If any term or condition hereof becomes invalid, void or unenforceable, the remainder of the terms and conditions shall remain in full force and effect and shall be binding on both parties hereto.
<br/>6.3 Matters Not Covered Herein. Any and all matters not covered herein shall be subject to the User Agreement.



        `
      }
    };
  }
  render() {
    const { classes } = this.props;
    const lang = window.localStorage.lang;
    return (
      <div className={classes.doc}>
        <h2 dangerouslySetInnerHTML={{ __html: this.state.title[lang] }} />
        <p dangerouslySetInnerHTML={{ __html: this.state.content[lang] }} />
      </div>
    );
  }
}

export default withStyles(styles)(Agreement);

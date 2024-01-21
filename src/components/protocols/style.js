export default theme => ({
    container: {
        maxWidth: 1200,
        minWidth: 1040,
        margin: "40px auto",
        "& h4": {
          fontSize: 20,
          padding: "10px 0 20px",
          fontWeight: 700
        },
        "& h2": {
          fontSize: 26,
          textAlign: "center",
          margin: "20px 0 30px",
          fontWeight: 700
        },
        "& p": {
          lineHeight: 1.5,
          paddingBottom: 15,
          textAlign: "justify",
          fontSize: 16,
          paddingLeft: 20
        },
        "& ul": {
          paddingLeft: 50,
          paddingBottom: 10,
          "& li": {
            paddingBottom: 8,
            fontStyle: "italic",
            fontWeight: 700,
            opacity: .8
          }
        }
      }
      
})
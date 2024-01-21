export default theme => ({
    banner: {
        width: "100%",
        padding: "0",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        "& ul": {
          display: "flex",
          // flexWrap: "wrap",
          transitionProperty: "transform",
          transitionDuration: ".2s",
          "& img": {
            borderRadius: 4
          }
        },
        "& .thumb": {
            position: "absolute",
            right: 0,
            bottom: 0,
            width: "100%",
            height: 10,
            display: "flex",
            // flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            "& div": {
              width: 24,
              height: 4,
              cursor: "pointer",
              marginLeft: 8
            },
            "& span": {
              width: 24,
              height: 4,
            //   background: theme.palette.border.common,
              background: "rgba(255,255,255,0.3)",
              cursor: "pointer",
              display: "block",
              margin: "0 auto",
              "&.active": {
                background: "rgba(255,255,255,0.8)",
              }
            }
        }
    },
    
})
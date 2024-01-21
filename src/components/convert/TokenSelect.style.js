export default (theme) => ({
  tokenSelectContainer: {
    width: 464,
    height: 72,
    background: "#FFFFFF",
    border: "1px solid #E9EAEB",
    boxSizing: "border-box",
    borderRadius: 4,
    padding: "22px 24px 10px",
    position: "relative",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    "& .inputLabel": {
      fontSize: 12,
      color: "#50555B",
      display: "block",
      position: "absolute",
      top: 10,
      left: 24,
    },
    "& .input": {
      width: 240,
      height: "100%",
      padding: 0,
      border: "none",
      fontWeight: "bold",
      fontSize: 20,
      lineHeight: "24px",
      "&::-webkit-input-placeholder": {
        color: "#D3D5D6",
        fontWeight: 400,
      },
      "&:focus": {
        outline: "none",
      },
    },
  },

  tokenSelect: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    cursor: "pointer",
    padding: "8px 2px 8px 5px",

    "&:hover": {
      background: "rgba(51,117,224,0.05)",
      borderRadius: 8,
    },

    "& .tokenSelect-wrap": {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",

      "& .token-logo": {
        width: 24,
        height: 24,
        borderRadius: "50%",
        marginRight: 4,
      },

      "& .token-symbol": {
        fontWeight: "bold",
        fontSize: 20,
        color: "#242B32",
      },
    },
    "& .tokenSelect-icon": {
      marginLeft: 4,
      transition: "transform 0.5s",
      "&.reverse": {
        transform: "rotate(180deg)",
      },
    },
  },

  tokenSelectPoper: {
    zIndex: 99,
    position: "absolute",
    width: "464px",
    left: -1,
    top: 71,
    background: "#FFF",
    boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.2)",
    borderRadius: 4,
    display: "flex",
    flexDirection: "column",
    visibility: "hidden",
    transistion: "visibility 0.5s",
    "&.on": {
      visibility: "visible",
    },
  },
  selectPoperHeader: {
    padding: "15px 32px",
    borderBottom: "1px solid #F4F4F5",
    "& input": {
      width: 240,
      height: "100%",
      padding: 0,
      border: "none",
      fontSize: 16,
      lineHeight: "24px",
      color: "#242B32",

      "&::-webkit-input-placeholder": {
        color: "#919598",
      },
      "&:focus": {
        outline: "none",
      },
    },
  },
  selectPoperItems: {
    padding: "10px 0",
    height: 300,
    overflowY: "scroll",

    "&::-webkit-scrollbar": {
      width: 3,
    },
    "::-webkit-scrollbar-track-piece": {
      background: "transparent",
    },
    "::-webkit-scrollbar-thumb": {
      height: 4,
      background: "#ebebeb",
      borderRadius: 2,
    },
  },
  selectPoperItem: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    padding: "8px 32px",
    "&:hover": {
      background: "#F7F9FC",
    },
    "&.active": {
      background: "#F7F9FC",
    },
    "& .token-logo": {
      width: 40,
      height: 40,
      borderRadius: "50%",
      marginRight: 16,
    },
    "& .token-symbol": {
      fontWeight: "bold",
      fontSize: 20,
      color: "#242B32",
    },
  },
});

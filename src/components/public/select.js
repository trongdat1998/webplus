import React from "react";
import Downshift from "downshift";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import styles from "./select_style";

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput
        },
        ...InputProps
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestionProps) {
  const {
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem
  } = suggestionProps;
  const isHighlighted = highlightedIndex === index;
  const isSelected = (`${selectedItem}` || "").indexOf(suggestion.label) > -1;
  return (
    <MenuItem
      {...itemProps}
      key={suggestion.id}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {suggestion.value}
    </MenuItem>
  );
}

function getSuggestions(
  suggestions = [],
  value,
  firstRender,
  { showEmpty = false } = {}
) {
  const inputValue = (value || "")
    .replace(/^\s+/, "")
    .replace(/\s+$/, "")
    .toLowerCase();
  return suggestions.filter(suggestion => {
    const keep =
      (suggestion.search || suggestion.label || "")
        .toLowerCase()
        .indexOf(inputValue) > -1 || firstRender;
    return keep;
  });
}

class IntegrationDownshift extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      firstRender: true // 初始渲染全部数据，触发1次change后根据结果进行过滤数据
    };
  }
  onFocus = () => {
    this.setState({
      isOpen: true
    });
  };
  onBlur = () => {
    this.setState({
      isOpen: false
    });
  };
  render() {
    const classes = this.props.classes;

    return (
      <Downshift
        id="downshift-simple"
        onChange={this.props.onChange}
        selectedItem={this.props.value}
      >
        {({
          clearSelection,
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          highlightedIndex,
          inputValue,
          isOpen,
          openMenu,
          selectedItem
        }) => {
          const { onBlur, onFocus, ...inputProps } = getInputProps({
            onChange: event => {
              this.setState({
                firstRender: false
              });
              if (event.target.value === "") {
                clearSelection();
              }
            },
            onFocus: openMenu
          });
          const { InputProps, ref, ...other } = inputProps;

          return (
            <div className={classes.container}>
              {renderInput({
                fullWidth: true,
                classes,
                InputLabelProps: getLabelProps(
                  this.props.noshrink && !this.props.value
                    ? {}
                    : {
                        shrink: true
                      }
                ),
                label: this.props.label,
                InputProps: { onBlur, onFocus },
                inputProps
              })}

              <div {...getMenuProps()}>
                {isOpen ? (
                  <Paper
                    className={classes.paper}
                    square
                    style={{
                      minHeight: 92,
                      maxHeight: 184,
                      overflow: "auto",
                      minWidth: 150
                    }}
                  >
                    {getSuggestions(
                      this.props.options,
                      inputValue,
                      this.state.firstRender
                    ).map((suggestion, index) =>
                      renderSuggestion({
                        suggestion,
                        index,
                        itemProps: getItemProps({ item: suggestion.label }),
                        highlightedIndex,
                        selectedItem
                      })
                    )}
                  </Paper>
                ) : null}
              </div>
            </div>
          );
        }}
      </Downshift>
    );
  }
}

export default withStyles(styles)(IntegrationDownshift);

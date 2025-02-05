import { darken, lighten } from "@mui/material"
import { StylesConfig } from "react-select"
import { colors } from "./theme"

const SelectStyle: StylesConfig = {
    option: (provided, state) => ({
        ...provided,
        borderBottom: "1px dotted black",
        backgroundColor: "#171a23",
        ":hover": {
            backgroundColor: lighten("#171a23", .3)
        },
        color: 'white',
        padding: 20
    }),
    control: () => ({
        // none of react-select's styles are passed to <Control />
        display: "flex",
        backgroundColor: "#171a23",
        padding: "5px",
        borderRadius: "5px",
        border: "1px solid white"
    }),
    multiValueLabel: () => ({
        color: "white",
        backgroundColor: darken("#171a23", .2),
        fontSize: "12px",
        padding: "5px",
        borderRadius: "5px 0px 0px 5px"
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: "transparent"
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        backgroundColor: "red"
    }),
    input: (provided) => ({
        ...provided,
        color: "white",
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "white"
    }),
    menuList: (provided) => ({
        ...provided,
        backgroundColor: darken("#171a23", .2)
    })
}

export default SelectStyle
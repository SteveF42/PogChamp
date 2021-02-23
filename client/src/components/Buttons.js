import {green, blue} from '@material-ui/core/colors'
import {Button, withStyles} from '@material-ui/core'

export const GreenButton = withStyles({
    root:{
        backgroundColor: green[400],
        '&:hover': {
            backgroundColor: green[500]
        }
    }
})(Button)
export const BlueButton = withStyles({
    root:{
        backgroundColor: blue[400],
        '&:hover': {
            backgroundColor: blue[500]
        }
    }
})(Button)
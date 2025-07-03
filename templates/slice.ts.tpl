import { createSlice } from '@reduxjs/toolkit'
import { <%= interfaceName %> } from './types'

const initialState: <%= interfaceName %> = <%- initialStateString %>

const <%= sliceName %>Slice = createSlice({
  name: '<%= sliceName %>',
  initialState,
  reducers: {
<%- actionCases %>
  }
})

export const { <%= actionExports %> } = <%= sliceName %>Slice.actions
export default <%= sliceName %>Slice.reducer

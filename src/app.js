import React, { Component } from 'react'
import _ from 'lodash'
import {Block, Flex} from 'jsxstyle'

const Button = (props) => <button type='button' {...props} style={{...props.style}} />

const fetchJson = (...args) => fetch(...args).then(r => r.json())
const SERVER = process.env.SERVER || 'http://localhost:3005'

const combos = [
  {type: 'webp', density: '1x'},
  {type: 'jpg', density: '1x'},
  {type: 'webp', density: '2x'},
  {type: 'jpg', density: '2x'},
]

const srcset = (id, width=400) =>
  combos
    .map(({type, density}) =>
      `${SERVER}/completed/${id}/featured?type=${type}&density=${density}&width=${width} ${density}`)
    .join(', ')

function Job({date, featured, id, info, metadata, photos, title, year, style}) {
  return (
    <Flex
      flexDirection='column'
      backgroundColor='white'
      boxShadow='0 5px 10px rgba(0,0,0,0.1)'
      borderRadius='5px'
      overflow='hidden'
      {...style}
    >
      <Block
        padding='1em'
        overflow='hidden'
        whiteSpace='nowrap'
        textOverflow='ellipsis'
        cursor='default'
      >
        {date} • {title}
      </Block>
      <Block
        component='figure'
        transition='margin 0.1s, height 0.1s, border-radius 0.1s'
        margin='0 1em 1em'
        hoverMargin='0 0.5em 0.5em'
        height='300px'
        hoverHeight='calc(300px + (1em - 0.5em))'
        borderRadius='3px'
        overflow='hidden'
      >
        <Block
          component='img'
          maxWidth='100%'
          width='100%'
          height='100%'
          objectFit='cover'
          props={{
            srcSet: srcset(id),
          }}
        />
      </Block>
    </Flex>
  )
}

class App extends Component {
  state = {
    loading: true,
    jobs: [],
  }

  componentWillMount() {
    this.load()
  }

  load = async () => {
    let data = await fetchJson(`${SERVER}/completed`)
    this.setState({jobs: data})
  }

  render() {
    return (
      <Flex
        flexFlow='row wrap'
        justifyContent='space-around'
        padding='15px'
        //backgroundColor='#aeaeae'
        backgroundColor='#eaeaea'
      >
        {//_.sampleSize(this.state.jobs, 16).map(j =>
          _.shuffle(this.state.jobs).map(j =>
          <Job
            key={j.id}
            {...j}
            style={{width: '300px', margin: '15px'}}
          />)}
      </Flex>
    )
  }
}

export default App

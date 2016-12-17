import React, { Component } from 'react'
import _ from 'lodash'
import {Block, Flex} from 'jsxstyle'

const fetchJson = (...args) => fetch(...args).then(r => r.json())
const SERVER = process.env.SERVER || 'http://localhost:3005'

const combos = [
  {type: 'jpg', density: '1x'},
  {type: 'webp', density: '1x'},
  {type: 'jpg', density: '2x'},
  {type: 'webp', density: '2x'},
]

const featuredSrcset = (id, width=400) =>
  combos
    .map(({type, density}) =>
      `${SERVER}/completed/${id}/featured?type=${type}&density=${density}&width=${width} ${density}`)
    .join(', ')

const regularSrcset = (id, imageName, width=200) =>
  combos
    .map(({type, density}) =>
      `${SERVER}/completed/${id}/thumb/${encodeURIComponent(imageName)}?type=${type}&density=${density}&width=${width} ${density}`)
    .join(', ')

function ModalJob({date, featured, id, info, metadata, photos, title, year, style, onClose}) {
  console.log(arguments)
  return (
    <Flex
      position='fixed'
      top='0px'
      right='0px'
      bottom='0px'
      left='0px'
      background='rgba(0, 0, 0, 0.0980392)'
      justifyContent='center'
      alignItems='center'
      props={{onClick: onClose}}
    >
      <Flex
        flexDirection='column'
        backgroundColor='white'
        boxShadow='0 5px 10px rgba(0,0,0,0.1)'
        borderRadius='5px'
        width='600px'
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
              srcSet: featuredSrcset(id),
            }}
          />
        </Block>

        <Flex
          flexFlow='row wrap'
          justifyContent='center'
        >
          {photos.map((p, i) =>
            <Flex
              key={i}
              component='figure'
              borderColor={p.filename === featured ? 'lightblue' : 'transparent'}
              borderWidth='5px'
              borderStyle='solid'
              transition='transform 0.1s, filter 0.1s'
              flex='1 0 auto'
              borderRadius='3px'
              overflow='hidden'
              hoverTransform='scale(1.05)'
              //filter={p.filename === featured ? '' : 'sepia(100%)'}
              //hoverFilter={'sepia(0%)'}
            >
              <Block
                component='img'
                maxWidth='100%'
                width='100%'
                height='100%'
                objectFit='cover'
                props={{
                  srcSet: regularSrcset(id, p.filename),
                }}
              />
            </Flex>)}
        </Flex>
      </Flex>
    </Flex>
  )
}

function Job({date, featured, id, info, metadata, photos, title, year, style, onClick}) {
  return (
    <Flex
      flexDirection='column'
      backgroundColor='white'
      boxShadow='0 5px 10px rgba(0,0,0,0.1)'
      borderRadius='5px'
      overflow='hidden'
      props={{onClick: () => onClick(id)}}
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
            srcSet: featuredSrcset(id),
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
    let data = await fetchJson(`${SERVER}/completed?count=8`)
    data = _.sampleSize(data, 8)
    data = _.shuffle(data)
    this.setState({jobs: data})
  }

  showModal = (id) => {
    this.setState({selected: id})
  }

  hideModal = () => {
    this.setState({selected: null})
  }

  render() {
    return (
      <Flex
        flexFlow='row wrap'
        justifyContent='space-around'
        alignItems='center'
        padding='15px'
        backgroundColor='#eaeaea'
        minHeight='100vh'
      >
        {this.state.jobs.map(j =>
          <Job
            key={j.id}
            {...j}
            onClick={this.showModal}
            style={{width: '300px', margin: '15px'}}
          />)}
        {this.state.selected
          ? <ModalJob
            {...this.state.jobs.find(j => j.id === this.state.selected)}
            onClose={this.hideModal}
          />
          : null}
      </Flex>
    )
  }
}

export default App

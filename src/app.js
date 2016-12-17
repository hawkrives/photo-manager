import React, { Component } from 'react'
import _ from 'lodash'
import {Block, Flex} from 'jsxstyle'
import makeStyleComponentClass from 'jsxstyle/lib/makeStyleComponentClass'
const Grid = makeStyleComponentClass({display: 'grid'}, 'Grid');

import {Tagger} from './tagger'

const fetchJson = (...args) => fetch(...args).then(r => r.json())
const SERVER = process.env.SERVER || 'http://localhost:3005'

const combos = [
  {type: 'jpg', density: '1x'},
  {type: 'webp', density: '1x'},
  {type: 'jpg', density: '2x'},
  {type: 'webp', density: '2x'},
]

function JobMetadata({date, id, info, metadata, year, title}) {
  return (
    <Tagger
      date={date}
      id={id}
      info={info}
      title={title}
      metadata={metadata}
      onChangeMetadata={key => value => console.log(key, value)}
      year={year}
    />
  )
}

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
  return (
    <Grid
      position='fixed'
      top='0px'
      right='0px'
      bottom='0px'
      left='0px'
      background='rgba(0, 0, 0, 0.0980392)'
      justifyContent='center'
      alignItems='center'
      gridTemplateAreas='"t t t" "l dialog r" "b b b"'
      gridTemplateRows='100px 1fr 100px'
      gridTemplateColumns='100px 1fr 100px'
      props={{onClick: onClose}}
    >
      <Grid
        gridArea='dialog'
        gridTemplateAreas='"title title" "photos info"'
        gridTemplateRows='auto 1fr'
        gridTemplateColumns='1fr 300px'
        border='solid 5px black'
        backgroundColor='white'
        boxShadow='0 5px 10px rgba(0,0,0,0.5)'
        borderRadius='5px'
        padding='1em'
        overflowY='auto'
        maxHeight='calc(100vh - 210px)'
        props={{onClick: ev => ev.stopPropagation()}}
        {...style}
      >
        <Block
          padding='1em'
          cursor='default'
          gridArea='title'
        >
          {date} • {title}
        </Block>

        <Grid
          gridArea='photos'
          gridAutoRows='200px'
          gridTemplateColumns='repeat(2, 1fr)'
          justifyContent='center'
        >
          {photos.map((p, i) =>
            <Block
              key={i}
              component='figure'
              margin='0.5em'
              borderColor={p.filename === featured ? 'lightblue' : 'transparent'}
              borderWidth='5px'
              borderStyle='solid'
              transition='transform 0.1s, filter 0.1s'
              borderRadius='3px'
              overflow='hidden'
              hoverTransform='scale(1.05)'
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
            </Block>)}
        </Grid>

        <JobMetadata {...{
          date,
          id,
          info,
          metadata,
          title,
          year,
        }} />
      </Grid>
    </Grid>
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
    let data = await fetchJson(`${SERVER}/completed`)
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

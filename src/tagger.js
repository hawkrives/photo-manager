import React from 'react'
import isArray from 'lodash/isArray'
import startCase from 'lodash/startCase'
import {Block, Inline} from 'jsxstyle'

const CATEGORIES = ['Monument', 'Bench', 'Inscription', 'Statue', 'Reference', 'WIP', 'Other']
const MATERIALS = ['Granite', 'Bronze', 'Marble', 'Other']
const SIZES = ['Single', 'Double', 'Family', 'Monumental']

const DETAIL_LIST = ['shape', 'style', 'color', 'finish', 'attributes']

const DETAILS = {
  granite: {
    shape: {
      $type: 'or',
      $options: ['Serp Top', 'Flat Marker', 'Cross', 'Flat Top', 'Heart', 'Double Heart', 'Teardrop', 'Flame', 'Gothic', 'Custom', 'Boulder', 'Other'],
    },
    style: {
      $type: 'or',
      $options: ['Upright', 'Slant', 'Flat', 'VA Marker'],
    },
    color: {
      $type: 'or',
      $options: ['Black', 'Gray', 'Rose', 'Pink', 'Mahogany', 'Red', 'Green', 'Blue', 'Other'],
    },
    finish: {
      $type: 'or',
      $dependsOn: 'style',
      upright: ['Polish 2', 'Polish 3', 'All Polish', 'Flamed', 'Frosted', 'Sawn', 'Other'],
      slant: ['Polish Slant Face', 'All Polish', 'Flamed', 'Frosted', 'Sawn', 'Other'],
      flat: ['Polish Flat Top', 'Flamed', 'Frosted', 'Sawn', 'Other'],
      'va marker': ['Normal', 'Other'],
    },
    attributes: {
      $type: 'and',
      $options: [
        'Porcelain Photo',
        'Laser Etching',
        'Gold Leaf',
        'Shape Carving',
        'US Metalcraft Vase',
        'Bronze Vase',
        'Granite Vase',
        'Other',
        'Frosted Lettering',
        'Frosted Outline Lettering',
      ],
    },
  },
  bronze: {
    shape: null,
    style: {
      $type: 'or',
      $options: ['Flat', 'VA Marker', 'Upright'],
    },
    color: null,
    finish: {
      $type: 'or',
      $dependsOn: 'style',
      upright: ['Normal', 'Other'],
      flat: ['Normal', 'Other'],
      'va marker': ['Normal', 'Other'],
    },
    attributes: {
      $type: 'and',
      $options: [
        'Bronze Montage',
        'Bronze Vase',
        'Other',
      ],
    },
  },
  marble: {
    shape: {$type: 'or', $options: ['Serp Top', 'Cross', 'Heart', 'Double Heart', 'Teardrop', 'Flame', 'Gothic', 'Other']},
    style: {$type: 'or', $options: ['Upright', 'Flat', 'VA Marker']},
    color: {$type: 'or', $options: ['White', 'Other']},
    finish: {
      $type: 'or',
      $dependsOn: 'style',
      upright: ['Normal', 'Rock Pitch', 'Other'],
      flat: ['Normal', 'Other'],
      'va marker': ['Normal', 'Other'],
    },
    attributes: {
      $type: 'and',
      $options: [
        'Other',
      ],
    },
  },
}

function Selector(props) {
  let {type, title, selected, options, onChange, warning} = props
  let inputType = type === 'and'
    ? 'checkbox'
    : 'radio'

  return (
    <Block className={`selector ${inputType}`}>
      <Block component='h2'>{title}</Block>
      <Block className='contents'>
        {warning
          ? <Block>{warning}</Block>
          : options.map(val => {
            let isChecked = isArray(selected)
              ? selected.includes(val)
              : val === selected

            return (
              <Block component='label' key={val}>
                <input
                  type={inputType}
                  value={val}
                  name={title}
                  checked={isChecked}
                  onChange={ev => onChange(ev.target.value)}
                />
                <Inline>{val}</Inline>
              </Block>
            )
          })}
      </Block>
    </Block>
  )
}
Selector.defaultProps = {
  options: [],
}

export function Tagger({info, onChangeMetadata}) {
  let {category, material, size} = info

  return (
    <Block component='form'>
      <Selector
        type='or'
        title='Category'
        selected={category}
        options={CATEGORIES}
        onChange={onChangeMetadata('Category')}
      />
      <Selector
        type='or'
        title='Material'
        selected={material}
        options={MATERIALS}
        onChange={onChangeMetadata('Material')}
      />
      <Selector
        type='or'
        title='Size'
        selected={size}
        options={SIZES}
        onChange={onChangeMetadata('Size')}
      />
      {DETAIL_LIST.map(startCase).map(title => {
        if (!material) {
          return null
        }
        let selected = DETAILS[material.toLowerCase()]
        let possibilities = selected[title.toLowerCase()]
        if (!possibilities) {
          return null
        }

        let type = possibilities.$type
        let options = possibilities.$options

        if (possibilities.$dependsOn) {
          let dependsOn = info[possibilities.$dependsOn]
          if (dependsOn) {
            dependsOn = dependsOn.toLowerCase()
          }
          options = possibilities[dependsOn]
        }

        if (!options) {
          options = null
        }

        return <Selector
          key={title}
          type={type}
          title={title}
          selected={info[title.toLowerCase()]}
          options={options}
          warning={!options && possibilities.$dependsOn ? `Please select a ${possibilities.$dependsOn.toLowerCase()}` : false}
          onChange={onChangeMetadata(title)}
        />
      })}
    </Block>
  )
}

import React from 'react'
import white_front from '../assets/pieces/shirt/30.png'
import white_back from '../assets/pieces/shirt/29.png'
import black_front from '../assets/pieces/shirt/4.png'
import black_back from '../assets/pieces/shirt/3.png'
import red_front from '../assets/tshirt/red/front.png'
import red_back from '../assets/tshirt/red/back.png'

export const tshirts = [white_front, white_back, black_front, black_back, red_front, red_back];

export default function TshirtView({ color, direction }) {

    switch (color) {
        case 'black':
            if (direction === 'front') {
                return <img className='w-full sm:max-w-md max-w-[280px]'  src={black_front} />
            }
            return <img className='w-full sm:max-w-md max-w-[280px]' src={black_back} />

        case 'white':
            if (direction === 'front') {
                return <img className='w-full sm:max-w-md max-w-[280px]' src={white_front} />
            }
            return <img className='w-full sm:max-w-md max-w-[280px]' src={white_back} />

        default:
            if (direction === 'front') {
                return <img className='w-full sm:max-w-md max-w-[280px]' src={red_front} />
            }
            return <img className='w-full sm:max-w-md max-w-[280px]' src={red_back} />
    }
}


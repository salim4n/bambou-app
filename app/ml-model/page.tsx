"use client"

import { Button, Flex } from "antd";

import * as tfjs from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

export default function Page(){


    return (
        <Flex>
            <Button onClick={() => {
                console.log(tfjs.version)
            }}>Check TFJS Version</Button>
            <Button onClick={() => {
                tfvis.visor().open()
            }}>Open TFJS Visor</Button>

        </Flex>
    )
} 
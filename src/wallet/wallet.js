import { InjectedConnector } from '@web3-react/injected-connector'

const METAMASK = 'METAMASK'

const metamaskInjector = () => {
    return new InjectedConnector({
        supportedChainIds: [1, 4],
    })
}

const createInjector = (name) => {
    switch(name) {
        case METAMASK:
            return metamaskInjector()
        default:
            return null

    }
}

export { METAMASK }
export { createInjector }
import * as React from 'react';

import {Section} from '../Components/Section';
import {Duration} from '../Components/Duration';
import {DemoProvider} from '../Providers/DemoProvider';
import {Dropzone} from '../Components/Dropzone';
import {Footer} from '../Components/Footer';
import {PluginSection} from '../Components/PluginSection';
import 'dataview-getstring';

import './UploadPage.css';
import '../Components/TeamBanner.css';
import {User} from "../Providers/AuthProvider";
import Element = JSX.Element;
import {History} from "history";

export interface GetStringDataView extends DataView {
    getString: (offset: number, length: number) => string;
}

function parseHeader(file, cb) {
    const reader = new FileReader();

    reader.onload = function () {
        const view: GetStringDataView = new DataView(reader.result) as GetStringDataView;
        cb({
            'type': view.getString(0, 8),
            'server': view.getString(16, 260),
            'nick': view.getString(276, 260),
            'map': view.getString(536, 260),
            'game': view.getString(796, 260),
            'duration': view.getFloat32(1056, true)
        });
    };

    reader.readAsArrayBuffer(file);
}

export interface DemoHead {
    type: string;
    server: string;
    nick: string;
    map: string;
    game: string;
    duration: number;
}

export interface UploadPageState {
    loading: boolean;
    demoInfo: null | DemoHead;
    names: {
        red: string;
        blue: string;
    }
    demoName: string;
    demoFile: File | null;
    error: null | string;
}

export interface UploadPageProps {
    user: User;
    router: History
}

export class UploadPage extends React.Component<UploadPageProps, UploadPageState> {
    provider: DemoProvider;

    static page = 'upload';

    static contextTypes = {
        router: React.PropTypes.object
    };

    state: UploadPageState = {
        demoInfo: null,
        demoFile: null,
        demoName: '',
        names: {red: '', blue: ''},
        loading: false,
        error: null
    };

    constructor(props) {
        super(props);
        this.provider = new DemoProvider();
    }

    componentDidMount() {
        document.title = "Upload - demos.tf";
    }

    onDrop = (files) => {
        const file = files[0];
        this.handleDemo(file);
    };

    extractTeamNames = function (name) {
        const matches = name.match(/(\w+)_vs_(\w+)/);
        if (matches) {
            return {
                red: matches[2].toUpperCase(),
                blue: matches[1].toUpperCase()
            }
        } else {
            return null;
        }
    };

    handleDemo = (file) => {
        this.setState({demoName: file.name, demoFile: file});
        parseHeader(file, head => {
                if (head.type === 'HL2DEMO') {
                    const names = this.extractTeamNames(file.name);
                    if (names) {
                        this.setState({names});
                    }
                    this.setState({demoInfo: head});
                } else {
                    this.setState({demoInfo: null});
                }
            }
        )
    };

    upload = async () => {
        this.setState({loading: true});
        try {
            const id = await this.provider.uploadDemo(this.props.user.key, this.state.names.red || 'RED',
                this.state.names.blue || 'BLU', this.state.demoName, this.state.demoFile as File);

            this.setState({loading: false});
            if (id) {
                this.props.router.push('/' + id);
            } else {
                this.setState({error: `Error: unexpected response from api`});
            }
        } catch (e) {
            this.setState({error: `Error: ${e.message}`});
        }
    };

    render() {
        let demoInfo: any[] | Element = [];
        if (this.state.demoInfo) {
            demoInfo = (
                <div className="demo-info">
                    {this.state.demoInfo.map}
                    <Duration className="time"
                              duration={Math.floor(this.state.demoInfo.duration)}/>
                </div>
            );
        }
        const dropText = this.state.error ? this.state.error : (this.state.loading ? 'Uploading...' : (this.state.demoName ? this.state.demoName : undefined));
        return (
            <div>
                <section className="upload">
                    <div className="teams">
                        <div className="red">
                            <input type="text" name="red"
                                   placeholder="RED"/>
                        </div>
                        <div className="blue">
                            <input type="text" name="blue"
                                   placeholder="BLU"/>
                        </div>
                        <div id="clearfix"/>
                    </div>
                    <Dropzone onDrop={this.onDrop}
                              text={dropText}/>
                    {demoInfo}
                    <button onClick={this.upload}
                            className="pure-button pure-button-primary"
                            disabled={(this.state.demoInfo == null) || this.state.loading}>
                        {this.state.loading ? 'Uploading...' : 'Upload'}
                    </button>
                </section>
                <Section title="API Key">
                    <pre>{this.props.user.key}</pre>
                </Section>

                <PluginSection user={this.props.user}/>
                <Footer />
            </div>
        );
    }
}

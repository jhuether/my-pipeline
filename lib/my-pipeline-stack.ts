import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { MyPipelineAppStage } from './my-pipeline-app-stage';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';

export class MyPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'MyPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('charge-science/my-pipeline', 'main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });

    const testStage = pipeline.addStage(new MyPipelineAppStage(this, 'test', {
      env: { account: '016066609783', region: 'us-west-2' }
    }));

    const devStage = pipeline.addStage(new MyPipelineAppStage(this, "dev", {
      env: { account: "016066609783", region: "us-west-2" }
    }));
    devStage.addPost(new ManualApprovalStep('approval'));

    
    

    // const wave = pipeline.addWave('wave');
    // wave.addStage(new MyPipelineAppStage(this, 'MyAppEU', {
    //   env: { account: '111111111111', region: 'eu-west-1' }
    // }));
    // wave.addStage(new MyApplicationStage(this, 'MyAppUS', {
    //   env: { account: '111111111111', region: 'us-west-1' }
    // }));

    // stage was returned by pipeline.addStage

    // stage.addPost(new ShellStep("validate", {
    //   commands: ['curl -Ssf https://my.webservice.com/'],
    // }));
  }
}
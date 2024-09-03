import * as rclnodejs from 'rclnodejs';
import {geometry_msgs, Node, Publisher} from "rclnodejs";

type MobilityMsg = {
  speed: number,
  direction: "forward" | "backward",
  angular: number //degrees
}

let pub: Publisher<any> | null = null;

async function mobility() {

  await rclnodejs.init();
  let node = new Node('mobility_node');

  pub = node.createPublisher('geometry_msgs/msg/Twist', 'cmd_vel');
  const sub = node.createSubscription(
      'std_msgs/msg/String',
      'mobility_json',
      subCallback
  );


}

function subCallback(message: any) {
  const msg: MobilityMsg = getMobilityMsg(message);

  const cmdVel: geometry_msgs.msg.Twist = msgToCmdVel(msg);

  publishCmdVel(cmdVel);
}

function getMobilityMsg(msg: any): MobilityMsg {

  const message = JSON.parse(msg);

  if(!message.speed || !message.direction || !message.angular)
    throw new Error('Invalid message');

  return message;
}

function msgToCmdVel(msg: MobilityMsg): geometry_msgs.msg.Twist {

  const cmdVel = rclnodejs.createMessageObject('geometry_msgs/msg/Twist');

  const speed = msg.speed;

  return cmdVel;
}

function publishCmdVel(message: geometry_msgs.msg.Twist) {
  if(pub == null)
    throw new Error('Publisher not initialized');

  pub.publish(message);
}


(async function main(): Promise<void> {
  mobility();
})().catch((): void => {
  process.exitCode = 1
})
<div id="protocole_6559" x:publishsource="Excel" align="center">

<colgroup><col style="mso-width-source:userset;mso-width-alt:731;width:15pt" width="20"> <col style="mso-width-source:userset;mso-width-alt:4059;width:83pt" width="111"> <col style="mso-width-source:userset;mso-width-alt:2669;width:55pt" width="73"> <col class="xl636559" style="mso-width-source:userset;mso-width-alt:
 1792;width:37pt" width="49"> <col class="xl636559" style="mso-width-source:userset;mso-width-alt:
 8265;width:170pt" width="226"> <col style="mso-width-source:userset;mso-width-alt:6144;width:126pt" width="168"> <col style="mso-width-source:userset;mso-width-alt:6436;width:132pt" width="176"> <col style="mso-width-source:userset;mso-width-alt:3840;width:79pt" width="105"> <col style="mso-width-source:userset;mso-width-alt:4498;width:92pt" width="123"> <col style="mso-width-source:userset;mso-width-alt:4352;width:89pt" width="119"> <col style="mso-width-source:userset;mso-width-alt:4425;width:91pt" width="121"> <col style="mso-width-source:userset;mso-width-alt:2998;
 width:62pt" span="2" width="82"> <col style="mso-width-source:userset;mso-width-alt:3291;width:68pt" width="90"> <col style="mso-width-source:userset;mso-width-alt:5924;width:122pt" width="162"> <col style="mso-width-source:userset;mso-width-alt:1645;width:34pt" width="45"> <col style="mso-width-source:userset;mso-width-alt:2450;width:50pt" width="67"> <col style="mso-width-source:userset;mso-width-alt:1645;
 width:34pt" span="3" width="45"></colgroup>
| Function | Command | Data |
| Connection | Request | 0x67 | 0x02 |
 Notification | Response | 0x63<span style="mso-spacerun:yes">�</span> | 0x01<font class="font06559"> : Unauthorized/Not paired</font> |
| 0x02<font class="font06559"> : Paired</font> |
| 0x04<font class="font06559"> : Authorized device</font> |
| 0x07<font class="font06559"> : Lamp disconnect imminent</font> |
| Power | Request | 0x40<span style="mso-spacerun:yes">�</span> | 0x01<font class="font06559"> : Turn on</font> |
| 0x02<font class="font06559"> : Turn off</font> |
| RGB Light | Request | 0x41 | 0xXX | 0xXX | 0xXX | 0x00 | 0xXX |
| Red | Green | Blue | Brightness (1~100) |
| Brightness | Request | 0x42 | 0xXX |
| Brighness (1~100) |
| Warm Light | Request | 0x43 | 0xXX | 0xXX | 0xXX |
| Temperature (1700~6500) | Brightness (1~100) |
| Lamp State | Request | 0x44 |
 Notification | Response | 0x45 | 0x01 <font class="font06559">: On</font> | <font class="font56559">0x01</font> <font class="font06559">: RGB light</font> | 0xXX | 0xXX | 0xXX | 0x00 | 0xXX | 0xXX | 0xXX | 0x1b <font class="font06559">: ??</font> |
| 0x02 <font class="font06559">: Off</font> | <font class="font56559">0x02</font> <font class="font06559">: White Light</font> | Red<span style="mso-spacerun:yes">�</span> | Green | Blue | Brightness (1~100) | Temperature (1700~6500) | 0x1c <font class="font06559">: ??</font> |
 <font class="font56559">0x03</font> <font class="font06559">: Flow</font> | 0 when not in RGB mode | 0x1d <font class="font06559">: ??</font> |
| Color flow | Request | 0x7c | 0x02 <font class="font06559">: ??</font> | 0x01 | 0xXX | 0x01 <font class="font06559">: ??</font> | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX |
| 0x06 <font class="font06559">: ??</font> | Flow speed (0~255) (app only goes 1~6) (fast~slow) | 0x04 <font class="font06559">: ??</font> | Red<span style="mso-spacerun:yes">�</span> | Green | Blue | Red<span style="mso-spacerun:yes">�</span> | Green | Blue | Red<span style="mso-spacerun:yes">�</span> | Green | Blue | Red<span style="mso-spacerun:yes">�</span> | Green | Blue |
 Color 1 | Color 2 | Color 3 (optional) | Color 4 (optional) |
| Read color flow | Request | 0x4c | 0x01 <font class="font06559">: ??</font> |
| 0x02 <font class="font06559">: Read RGB colors</font> |
| 0x03 <font class="font06559">: ??</font> |
 Notification | Response | 0x4d | 0x01 <font class="font06559">: ??</font> | 0xXX |
| 0x02 <font class="font06559">: RGB colors list</font> | 0x02 <font class="font06559">for 1st item on list</font> | 0x01 | 0xXX | 0xXX | 0xXX | <font class="font56559">0x06</font> <font class="font06559">: ??</font> |
| <font class="font56559">0x04</font> <font class="font06559">for 2nd item on list</font> | Red<span style="mso-spacerun:yes">�</span> | Green | Blue |
| 0xXX ?? |
| 0x03 <font class="font06559">: ??</font> |
 List position (start from 1) |
| 0xff <font class="font06559">: list end</font> |
| Write stop timer | Request | 0x7f | 0x03 <font class="font06559">: Activate timer</font> | 0xXX |
| 0x04 <font class="font06559">: Deactivate timer</font> | Time in minutes |
| Read stop timer | Request | 0x80 |
 Notification | Response | 0x81 | 0x01 | 0xXX | 0x01 : Activated | 0xXX | 0xXX |
| Time setted in minutes | 0x02 : Deactivated | Remaining time in seconds |
| Write night mode | Request | 0x6f | 0x00 <font class="font06559">: Deactivate mode</font> | 0x01 | 0xXX | 0xXX | 0xXX | 0xXX |
| 0x01 <font class="font06559">: Activate mode</font> | Start hour (write literral, ex : 22h57 -> 0x22 - 0x57) | End hour (write literral, ex : 22h57 -> 0x22 - 0x57) |
| Read night mode | Request | 0x70 |
 Notification | Response | 0x71 | 0x00 <font class="font06559">: Deactivated</font> | 0x01 | 0xXX | 0xXX | 0xXX | 0xXX |
| 0x01 <font class="font06559">: Activated</font> | Start hour (write literral, ex : 22h57 -> 0x22 - 0x57) | End hour (write literral, ex : 22h57 -> 0x22 - 0x57) |
| Write wake up light | Request | 0x88 | 0x06 | 0xXX | 0xXX | 0x00 | 0x01 <font class="font06559">: Once</font> | 0xXX | 0x00 | 0x1e | 0x01 | 0x01 | 0x00 <font class="font06559">: Deactivate mode</font> |
| Day number (write litteral) |
| 0x02 <font class="font06559">: Every day</font> | 0x00 |
| 0x03 <font class="font06559">: Custom</font> | 0xXX | 0x01 <font class="font06559">: Activate mode</font> |
| 1-Sunday 2-Monday 4-Tuesday 8-Wednesday 16-Thursday 32-Friday 64-Saturday To set multiple daysn you've got to add days numbers ex : Sunday and Monday -> 1 + 2 = 3� |
| Wake up hour (write literral) | Frequency |
| Read wake up light | Request | 0x89 | 0x06 |
 Notification | Response | 0x8a | 0x06 | 0xXX | 0xXX | 0x00 | 0xXX | 0xXX | 0x00 | 0x1e | 0x01 | 0x01 | 0x00 <font class="font06559">: Deactivated</font> |
| Wake up hour | Frequency | 0x01 <font class="font06559">: Activated</font> |
| Write date and time | Request | 0x60 | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX |
| second (write literral) | minute (write literral) | hour (write literral) | day (write literral) | weekday (write literral) (0-Sunday) | month (write literral) | year (write literral) |
| Write lamp name | Request | 0x51 | 0x01 | 0x00 <font class="font06559">: first name part</font> | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX |
| 0x01 <font class="font06559">: second name part</font> | Name string length<span style="mso-spacerun:yes">�</span> | Name string (ascii coding, 0 if not set) |
| Read lamp name | Request | 0x52 |
 Notification | Response | 0x53 | 0x01 | 0x00 <font class="font06559">: first name part</font> | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX | 0xXX |
| 0x01 <font class="font06559">: second name part</font> | Name string length<span style="mso-spacerun:yes">�</span> | Name string (ascii coding, 0 if not set) |
| Change light mode | Request | 0x4a | 0x01 <font class="font06559">: change to white mode</font> |
| 0x02 <font class="font06559">: change to flow mode</font> |
| 0x03 <font class="font06559">: change to RGB mode</font> |
| ?? | Request | 0x4a | send content received from <font class="font56559">0x43 0x4c 0x01</font> <font class="font06559">request (</font><font class="font56559">0x43 0x4d 0x01</font> <font class="font06559">response), i don't know what it's for</font> |
| send content received from <font class="font56559">0x43 0x4c 0x03</font> <font class="font06559">request (</font><font class="font56559">0x43 0x4d 0x03</font> <font class="font06559">response), i don't know what it's for</font> |
| Write list schedule | Request | 0x46 | TODO (i don't find this feature intresting) |
| Read list schedule | Request | 0x47 |
 Notification | Response | 0x49 | TODO (i don't find this feature intresting) |
| ?? | Request | 0x5c | I think it's something about the firmware version, but i'm not sure. |
 Notification | Response | 0x5d |
| Read statistic data<span style="mso-spacerun:yes">�</span> | Request | 0x8c |
 Notification | Response | 0x8d | i don't now data signification, and i don't realy care :) |
| 0x8e |
| 0x8f |
| 0x90 |
| 0x91 |

</div>
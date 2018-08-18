---
layout: post
title: "How to access iOS filesystem via usb"
comments: true
description: "How to access iOS filesystem via usb"
keywords: "SSH, iOS, jailbreak, filesystem"
---

*There are a couple of ways to do this…*

1. SSH Over USB connection
2. Mount the iDevice on the computer's filesystem using ifuse

*There are disadvantages, and advantages to each of these methods, as I will describe..*

## (1) SSH Over USB

### advantages

* minimal dependencies and work to build tools necessary
* SSH seems to be generally heralded as the more *secure* method of connection (for reasons I will explain in the iFuse disadvantages section) (The primary reason seeming to be that SSH is an encrypted tunnel connection, whereas mounting the filesystem is not. Also, AppleFileConduit2 is a dependency that is required for iFuse in order to have **root access** of the iDevice filesystem (notice I said **root access**, because ifuse uses a perfectly safe method to access parts of the filesystem that don't require root, and thus don't require a jailbroken target device) )

### disadvantages

* You must leave `iproxy` running in a seperate terminal tab/window to use this.
* Target idevice must be jailbroken (in order to have SSH installed)

### prereqs

* libimobiledevice

  *can install with **homebrew** using*
  
  `$ brew install libimobiledevice` 
  
  *or cloning from the [GitHub page](https://github.com/libimobiledevice) to build yourself*

* A jailbroken iDevice with OpenSSL installed from Cydia

### optional

* osxfuse w/ **sshfs** module

### steps

1. With your idevice plugged in, pair the device to your machine using

   `$ idevicepair pair`
   
   You may need to unlock your iDevice and press the "Trust" button when prompted. The command will return "SUCCESS" upon a successful pairing with the target.
   ​
   *If you have more than one iDevice connected, use the `-u ` flag to specify the specific UDID of the target device.*

2. In your terminal, type in

    `$ iproxy 2222 22`

    *You can also use the `-u` flag here to specify UDID of target as well.*

3. Open a new tab/window and log in as the root user using

   `$ ssh root@localhost -p 2222`
   
   and enter your password (if you haven't changed the default password, it's "alpine")

You should now have root access to your device! If you haven't changed your root password from the default, go ahead and change it with

 `$ passwd` 
 
while logged into the iDevice as root.

When you're finished, type in

`$ logout`

to logout of the ssh session. Then go to the open terminal session where you are running iproxy, and press the key combo `Ctrl+c` to stop the process.

### alternative steps

**If you want to get really savvy**, you can do a bit of a mix of mounting and SSH-ing into the filesystem. If you go to the [osxfuse website](https://osxfuse.github.io/), you can download the Fuse for OS X package along with the SSHFS package. If you install both, you can mount the iOS filesystem to a mountpoint on your machine (useful if you are going to do a lot of file transfers and such.)

`$ mkdir -p /path/to/desired/mountpoint`

Follow steps 1 & 2 above, then

`$ sshfs root@localhost:/remote/mountpoint -p 2222 /local/mountpoint`

Eureka! You should be able to access the remote filesystem via the mountpoint on your local machine.
When you are finished, unmount using the macOS default `umount` tool. The folder you created with the `-p` flag will disappear due to it having been a provisional directory!



## (2) Mount iDevice File System using ifuse

### advantages

* **No jailbreak required.** And if the target idevice is jailbroken and you have AFC2 (AppleFileConduit2) installed, you are able to have full file system access via ifuse.
* Mounts the idevice to the naitive filesystem.

### disadvatages

* Not as secure as SSH.
* More work to get set up and install correctly (on macOS that is.)


### installing fuse on macOS via Homebrew

type in 
`$ brew install homebrew/fuse/ifuse`

### installing ifuse on macOS via macports

follow [this guide][https://github.com/libimobiledevice/ifuse/wiki] on the ifuse GitHub wiki.

**Still experimenting with ifuse, don't know how to quite use it. was reading [this helpful page](https://wiki.gentoo.org/wiki/Apple_iPod,_iPad,_iPhone#Mounting) to learn some usage**
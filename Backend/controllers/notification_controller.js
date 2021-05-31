const {
  Notification,
  Reciever,
  User,
  Entity_Action_Desc,
} = require("../models");

async function create_notification(
  desc_id,
  sender_id,
  ref_id,
  sent_to,
  recieversParam
) {
  try {
    let recieversArray = recieversParam.map((id) => {
      return {
        notifier_id: id,
        is_read: false,
      };
    });

    const notification = await Notification.create(
      {
        desc_id,
        sender_id,
        ref_id,
        sent_to,
        Recievers: recieversArray,
      },
      {
        include: [Reciever],
      }
    );
    if (notification)
      return {
        valid: true,
        msg: "تم انشاء الاشعار بنجاح",
      };
    else
      return {
        valid: false,
        msg: "حدث خظا اثناء انشاء الاشعار",
      };
  } catch (error) {
    console.log({
      lineNumber: error.stack,
      message: error.message,
    });
    return {
      valid: false,
      msg: error.message,
    };
  }
}
async function get_notifications(id) {
  try {
    const { count, rows } = await Reciever.findAndCountAll({
      where: {
        notifier_id: id,
        is_read: false,
      },
      attributes: ["notification_id"],
      include: [
        { model: User, attributes: ["name"] },
        {
          model: Notification,
          attributes: ["ref_id"],
          include: [
            { model: Entity_Action_Desc, attributes: ["desc"] },
            { model: User, attributes: ["name"] },
          ],
        },
      ],
    });

    let notifications = rows.map((row) => {
      return {
        notification_id: row.notification_id,
        from: row.Notification.User.name,
        to: row.User.name,
        message: row.Notification.Entity_Action_Desc.desc,
      };
    });

    if (count !== 0)
      return {
        valid: true,
        msg: "تم ايجاد الاشعارات بنجاح",
        notifications,
      };
    else
      return {
        valid: false,
        msg: "لا توجد اشعارات",
      };
  } catch (error) {
    console.log({
      lineNumber: error.stack,
      message: error.message,
    });
    return {
      valid: false,
      msg: error.message,
    };
  }
}
async function make_notification_read(notifier_id, notification_id) {
  try {
    const notification = await Reciever.findOne({
      where: {
        notification_id,
        notifier_id,
      },
    });
    if (notification) {
      const flag = await Reciever.update(
        {
          is_read: true,
        },
        {
          where: {
            notification_id,
            notifier_id,
          },
        }
      );
      if (flag[0] === 1)
        return {
          valid: true,
          msg: "تم قراءة الاشعار بنجاح",
        };
      else
        return {
          valid: false,
          msg: "تم قراءة هذا الاشعار من قبل",
        };
    } else
      return {
        valid: false,
        msg: "هذا الاشعار غير موجود",
      };
  } catch (error) {
    console.log({
      lineNumber: error.stack,
      message: error.message,
    });
    return {
      valid: false,
      msg: error.message,
    };
  }
}
module.exports = {
  create_notification: create_notification,
  get_notifications: get_notifications,
  make_notification_read: make_notification_read,
};

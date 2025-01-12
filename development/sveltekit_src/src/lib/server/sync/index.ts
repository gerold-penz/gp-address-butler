import type { User, Username } from "$lib/interfaces"
import { Users } from "$lib/server/users"
import { Nextcloud } from "$lib/server/nextcloud"
import { env } from "$env/dynamic/private"


export const USER_NOT_FOUND_ERROR = "[USER NOT FOUND ERROR]"

/**
 * Update the user's address book definitions.
 * @param {Username} username
 */
export async function updateUserAddressBookDefinitions(username: Username) {
    console.debug(`sync.updateUserAddressBookDefinitions(${username})`)

    let user: User = Users.get(username)!
    if (!user) throw new Error(USER_NOT_FOUND_ERROR)

    let userAddressBooks = user?.addressBooks ?? []
    const ncAddressBooks = (await Nextcloud.getAddressBooks(username)) ?? []

    ncAddressBooks.forEach((ncAddressBook) => {

        // Push webAddressBook to userAddressBooks if not exists
        const found = Boolean(userAddressBooks.find((userAddressBook) => {
            const userAddressBookUrl = env.NEXTCLOUD_URL + userAddressBook.path
            return ncAddressBook.url === userAddressBookUrl
        }))
        if (!found) {
            userAddressBooks.push({
                path: ncAddressBook.url.substring(env.NEXTCLOUD_URL.length),
                displayName: ncAddressBook.displayName,
                active: true
            })
        }

        // Update display name
        const userAddressBook = userAddressBooks.find((userAddressBook) => {
            const userAddressBookUrl = env.NEXTCLOUD_URL + userAddressBook.path
            return userAddressBookUrl === ncAddressBook.url
        })
        if (userAddressBook) {
            userAddressBook.displayName = ncAddressBook.displayName
        }

    })

    // Delete userAdressBook if not in ncAddressBooks
    userAddressBooks = userAddressBooks.filter((userAddressBook) => {
        const userAddressBookUrl = env.NEXTCLOUD_URL + userAddressBook.path
        return ncAddressBooks.find((ncAddressBook) => {
            return ncAddressBook.url === userAddressBookUrl
        })
    })

    // Speichern
    user = Users.get(username)!
    user.addressBooks = userAddressBooks
    Users.set(user)

}
